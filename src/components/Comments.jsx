import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import { commentsService } from '../lib/supabase'

export const COMMENT_MAX = 500
const COOLDOWN_MS = 20000 // jeda antar komentar, mencegah spam
const COOLDOWN_KEY = 'cm-last-sent'

// ─── Waktu komentar ──────────────────────────────────────────
// Tanggal SELALU berasal dari created_at komentar (waktu saat diposting), bukan waktu browser dibuka.
const RELATIVE_DAYS = 7 // lebih baru dari ini: "5 menit yang lalu". Lebih lama: tanggal asli. Isi 0 = selalu tanggal + jam.
const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })

// Supabase kadang mengirim "2026-11-21 10:00:00+00" atau tanpa zona waktu.
// Safari menolak format itu dan tanpa zona waktu browser menganggapnya jam lokal (bergeser 7 jam di WIB).
function parseDate(value) {
  if (!value) return null
  let s = String(value).trim()
  const m = s.match(/^(\d{4}-\d{2}-\d{2})[T ](.+)$/)
  if (m) {
    let time = m[2].replace(/(\.\d{3})\d+/, '$1')
    if (/[+-]\d{2}$/.test(time)) time += ':00'
    if (!/(Z|[+-]\d{2}:\d{2})$/i.test(time)) time += 'Z'
    s = `${m[1]}T${time}`
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatTime(date, now) {
  const ago = (now - date.getTime()) / 1000
  if (RELATIVE_DAYS > 0 && ago < RELATIVE_DAYS * 86400) {
    if (ago < 60) return 'baru saja'
    if (ago < 3600) return rtf.format(-Math.floor(ago / 60), 'minute')
    if (ago < 86400) return rtf.format(-Math.floor(ago / 3600), 'hour')
    return rtf.format(-Math.floor(ago / 86400), 'day')
  }
  const day = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return RELATIVE_DAYS > 0 ? day : `${day}, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
}

// "Sekarang" yang diperbarui otomatis, jadi "baru saja" berubah sendiri menjadi "5 menit yang lalu"
function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const tick = () => document.visibilityState === 'visible' && setNow(Date.now())
    const id = setInterval(tick, intervalMs)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [intervalMs])
  return now
}

function readCooldown() {
  try {
    const left = COOLDOWN_MS - (Date.now() - Number(localStorage.getItem(COOLDOWN_KEY) || 0))
    return left > 0 ? left : 0
  } catch {
    return 0
  }
}

// ─── Hook: data komentar (dipakai oleh form di Contact.jsx) ──
export function useComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [cooldown, setCooldown] = useState(0)

  const addComment = (c) =>
    setComments((prev) => (prev.some((x) => x.id === c.id) ? prev : [c, ...prev])) // cegah dobel (realtime + hasil insert)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = (await commentsService.getAll()) || []
        if (alive) setComments(data)
      } catch {
        if (alive) setComments([]) // Supabase belum terhubung: tampilkan keadaan kosong, bukan pesan teknis
      } finally {
        if (alive) setLoading(false)
      }
    })()
    const channel = commentsService.subscribe((payload) => {
      if (payload.new?.approved) addComment(payload.new)
    })
    setCooldown(readCooldown())
    return () => {
      alive = false
      channel?.unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(readCooldown()), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // true = berhasil; melempar error kalau gagal
  const post = async ({ name, email, message }) => {
    const created = await commentsService.create({ name, email: email || null, message })
    if (created?.[0]) addComment(created[0])
    try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())) } catch { /* abaikan */ }
    setCooldown(COOLDOWN_MS)
    return true
  }

  return { comments, loading, cooldown, post }
}

// ─── Item & daftar komentar ──────────────────────────────────
function CommentItem({ comment, index, now }) {
  const posted = parseDate(comment.created_at)
  const initials = comment.name?.slice(0, 2).toUpperCase() || 'AN'
  const colors = ['#2DD4BF', '#FBBF24', '#A78BFA', '#F472B6', '#60A5FA'] // cukup terang agar kontras >= 4.5:1
  const color = colors[comment.name?.charCodeAt(0) % colors.length] || colors[0]

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05 }}
      className="glass rounded-xl p-4 border border-slate-700/30"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-display font-700 shrink-0"
          style={{ background: `${color}20`, color, border: `1.5px solid ${color}40` }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-display font-600 text-sm text-slate-200 truncate">{comment.name}</span>
            {posted && (
              <time
                dateTime={posted.toISOString()}
                title={posted.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                className="flex items-center gap-1 text-slate-400 text-xs font-mono shrink-0"
              >
                <Clock className="w-3 h-3" aria-hidden="true" />
                {formatTime(posted, now)}
              </time>
            )}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed break-words">{comment.message}</p>
        </div>
      </div>
    </motion.li>
  )
}

function Skeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-3" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="glass rounded-xl p-4 border border-slate-700/30 animate-pulse">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700/40" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-slate-700/40" />
              <div className="h-3 w-full rounded bg-slate-700/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CommentList({ comments, loading }) {
  const now = useNow()

  if (loading) return <Skeleton />
  if (comments.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <MessageSquare className="w-9 h-9 mx-auto mb-3 opacity-30" aria-hidden="true" />
        <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
      </div>
    )
  }
  return (
    <div
      role="region"
      aria-label="Daftar komentar"
      tabIndex={0}
      className="max-h-[420px] overflow-y-auto pr-1"
    >
      <ul className="grid md:grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {comments.map((c, i) => (
            <CommentItem key={c.id} comment={c} index={i} now={now} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
