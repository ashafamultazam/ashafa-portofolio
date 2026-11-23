import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Clock } from 'lucide-react'
import { commentsService } from '../lib/supabase'

export const COMMENT_MAX = 500
export const NAME_MAX = 60
const COOLDOWN_MS = 20000 // jeda antar komentar, mencegah spam
const COOLDOWN_KEY = 'cm-last-sent'
const PENDING_KEY = 'cm-pending' // komentar milik pengunjung ini yang belum disetujui (hanya terlihat olehnya)
const REFRESH_MS = 60000 // segarkan daftar tiap 60 dtk saat tab terlihat

// ─── Pembersihan & pemeriksaan input ─────────────────────────
// React sudah meng-escape HTML, jadi tidak ada risiko XSS. Ini untuk spam, teks tak kasat mata, dan trik tampilan.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B\u200C\u200E\u200F\u2028\u2029\u202A-\u202E\u2060-\u2069\uFEFF]/g
export const cleanName = (s = '') => s.replace(CONTROL, '').replace(/\s+/g, ' ').trim()
export const cleanMessage = (s = '') => s.replace(CONTROL, '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

const LINK = /(https?:\/\/|www\.|@[a-z0-9-]+\.[a-z]{2,}|\b[a-z0-9-]+\.(com|xyz|top|ru|shop|site|online|click|link|cc)\b)/i
const REPEAT = /(.)\1{9,}/ // "aaaaaaaaaa", "!!!!!!!!!!"

// Mengembalikan objek error per kolom ({} = lolos)
export function checkComment({ name, message }) {
  const e = {}
  const n = cleanName(name)
  const m = cleanMessage(message)
  if (!n) e.name = 'Nama wajib diisi'
  else if (LINK.test(n)) e.name = 'Nama tidak boleh berisi tautan'
  if (!m) e.message = 'Komentar wajib diisi'
  else if (m.length < 5) e.message = 'Komentar terlalu singkat (min. 5 karakter)'
  else if (LINK.test(m)) e.message = 'Komentar tidak boleh berisi tautan atau alamat email'
  else if (REPEAT.test(m)) e.message = 'Komentar berisi karakter berulang, mohon ditulis ulang'
  return e
}

// ─── Komentar tertunda (milik pengunjung ini) ────────────────
const normalize = (s = '') => cleanMessage(s).replace(/\s+/g, ' ').toLowerCase()
function readPending() {
  try {
    const week = 7 * 86400000
    const list = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
    return list.filter((c) => c?.id && Date.now() - new Date(c.created_at).getTime() < week).slice(0, 5)
  } catch {
    return []
  }
}
function writePending(list) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(0, 5))) } catch { /* abaikan */ }
}

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
  const [server, setServer] = useState([])
  const [pending, setPending] = useState(() => readPending())
  const [loading, setLoading] = useState(true)
  const [cooldown, setCooldown] = useState(0)

  const refresh = async () => {
    try {
      setServer((await commentsService.getAll()) || [])
    } catch {
      /* Supabase belum terhubung / offline: biarkan daftar apa adanya, tanpa pesan teknis */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // Komentar yang baru disetujui muncul tanpa reload: segarkan berkala & saat tab dibuka kembali
    const tick = () => document.visibilityState === 'visible' && refresh()
    const id = setInterval(tick, REFRESH_MS)
    document.addEventListener('visibilitychange', tick)
    setCooldown(readCooldown())
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  // Buang komentar tertunda yang sudah muncul di daftar resmi (artinya sudah disetujui)
  useEffect(() => {
    if (server.length === 0 || pending.length === 0) return
    const seen = new Set(server.map((c) => `${cleanName(c.name).toLowerCase()}|${normalize(c.message)}`))
    const left = pending.filter((c) => !seen.has(`${cleanName(c.name).toLowerCase()}|${normalize(c.message)}`))
    if (left.length !== pending.length) {
      setPending(left)
      writePending(left)
    }
  }, [server, pending])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(readCooldown()), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // Melempar error kalau gagal. name & message sudah dibersihkan di sini.
  const post = async ({ name, message }) => {
    const clean = { name: cleanName(name), message: cleanMessage(message) }
    await commentsService.create(clean)
    const mine = { id: `p-${Date.now()}`, ...clean, created_at: new Date().toISOString(), pending: true }
    const next = [mine, ...pending].slice(0, 5)
    setPending(next)
    writePending(next)
    try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())) } catch { /* abaikan */ }
    setCooldown(COOLDOWN_MS)
    return true
  }

  const comments = [...pending, ...server]
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
      className="rounded-lg p-3 bg-white/[0.03] border border-slate-700/30"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-display font-700 shrink-0"
          style={{ background: `${color}20`, color, border: `1.5px solid ${color}40` }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-display font-600 text-sm text-slate-200 truncate">
              {comment.name}
              {comment.pending && (
                <span className="ml-2 align-middle font-mono text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 whitespace-nowrap">
                  Menunggu persetujuan
                </span>
              )}
            </span>
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
          <p className="text-slate-300 text-sm leading-snug break-words">{comment.message}</p>
        </div>
      </div>
    </motion.li>
  )
}

function Skeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {[0].map((i) => (
        <div key={i} className="rounded-lg p-3 bg-white/[0.03] border border-slate-700/30 animate-pulse">
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
      <div className="text-center py-5 text-slate-400">
        <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-30" aria-hidden="true" />
        <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
      </div>
    )
  }
  return (
    <div
      role="region"
      aria-label="Daftar komentar"
      tabIndex={0}
      className="max-h-[230px] overflow-y-auto pr-1 -mr-1"
    >
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {comments.map((c, i) => (
            <CommentItem key={c.id} comment={c} index={i} now={now} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
