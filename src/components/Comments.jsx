import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, User, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { commentsService } from '../lib/supabase'
import SwipeToSend from './SwipeToSend'

const MAX = { name: 60, email: 120, message: 500 }
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
    let time = m[2].replace(/(\.\d{3})\d+/, '$1') // pecahan detik maksimal 3 digit
    if (/[+-]\d{2}$/.test(time)) time += ':00' // "+00" -> "+00:00"
    if (!/(Z|[+-]\d{2}:\d{2})$/i.test(time)) time += 'Z' // tanpa zona waktu = UTC
    s = `${m[1]}T${time}`
  }
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatTime(date, now) {
  const diff = (date.getTime() - now) / 1000 // negatif = di masa lalu
  const ago = -diff
  if (RELATIVE_DAYS > 0 && ago < RELATIVE_DAYS * 86400) {
    if (ago < 60) return 'baru saja' // termasuk selisih jam kecil antara server dan perangkat
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
    document.addEventListener('visibilitychange', tick) // segarkan saat tab dibuka kembali
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

// ─── Item komentar ───────────────────────────────────────────
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
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass rounded-xl p-4 border border-slate-700/30 animate-pulse">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700/40" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-slate-700/40" />
              <div className="h-3 w-full rounded bg-slate-700/30" />
              <div className="h-3 w-2/3 rounded bg-slate-700/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// text-base di HP (16px) mencegah iOS Safari memperbesar layar otomatis saat kolom difokuskan
const inputCls = (err) =>
  `w-full glass rounded-lg px-4 py-3 text-base sm:text-sm text-slate-100 placeholder-slate-500 border transition-colors outline-none focus:border-teal-500/60 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)] ${
    err ? 'border-red-500/50' : 'border-slate-700/40'
  }`

// ─── Komponen utama ──────────────────────────────────────────
export default function Comments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null) // { type: 'ok' | 'error', text }
  const [cooldown, setCooldown] = useState(0)
  const honeypot = useRef(null)
  const now = useNow()

  const addComment = (c) =>
    setComments((prev) => (prev.some((x) => x.id === c.id) ? prev : [c, ...prev])) // cegah dobel (realtime + hasil insert)

  useEffect(() => {
    loadComments()
    const channel = commentsService.subscribe((payload) => {
      if (payload.new?.approved) addComment(payload.new)
    })
    setCooldown(readCooldown())
    return () => channel?.unsubscribe?.()
  }, [])

  // hitung mundur jeda kirim
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(readCooldown()), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  // pesan status hilang sendiri
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 6000)
    return () => clearTimeout(t)
  }, [notice])

  const loadComments = async () => {
    try {
      setComments((await commentsService.getAll()) || [])
    } catch {
      setComments([]) // Supabase belum terhubung: tampilkan keadaan kosong, bukan pesan teknis
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Format email belum benar'
    if (form.message.trim().length < 5) e.message = form.message.trim() ? 'Pesan terlalu singkat (min. 5 karakter)' : 'Pesan wajib diisi'
    setErrors(e)
    if (e.name) document.getElementById('cm-name')?.focus()
    else if (e.email) document.getElementById('cm-email')?.focus()
    else if (e.message) document.getElementById('cm-message')?.focus()
    return Object.keys(e).length === 0
  }

  // dipanggil oleh tombol geser; true = berhasil
  const send = async () => {
    setNotice(null)
    if (!validate()) return false
    if (honeypot.current?.value) return true // bot mengisi kolom tersembunyi: pura-pura sukses
    try {
      const created = await commentsService.create({
        name: form.name.trim(),
        email: form.email.trim() || null,
        message: form.message.trim(),
      })
      if (created?.[0]) addComment(created[0])
      setForm({ name: '', email: '', message: '' })
      setErrors({})
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())) } catch { /* abaikan */ }
      setCooldown(COOLDOWN_MS)
      setNotice({ type: 'ok', text: 'Terima kasih! Komentar Anda sudah terkirim.' })
      return true
    } catch (err) {
      console.warn('Komentar gagal dikirim:', err?.message || err)
      setNotice({ type: 'error', text: 'Komentar belum bisa dikirim. Periksa koneksi lalu coba lagi.' })
      return false
    }
  }

  // ganti nilai kolom sekaligus menghapus error kolom itu (error tidak menggantung setelah diperbaiki)
  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er))
  }

  const left = form.message.length

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <div data-aos="fade-right">
        <h3 className="font-display font-600 text-xl text-slate-200 mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-400" aria-hidden="true" />
          Tinggalkan Komentar
        </h3>

        <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="cm-name" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">NAMA *</label>
            <input
              id="cm-name" name="name" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next"
              maxLength={MAX.name} required
              aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cm-name-err' : undefined}
              value={form.name}
              onChange={setField('name')}
              placeholder="Nama Anda"
              className={inputCls(errors.name)}
            />
            {errors.name && <p id="cm-name-err" role="alert" className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="cm-email" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">EMAIL (opsional, tidak ditampilkan)</label>
            <input
              id="cm-email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next"
              maxLength={MAX.email}
              aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cm-email-err' : undefined}
              value={form.email}
              onChange={setField('email')}
              placeholder="email@contoh.com"
              className={inputCls(errors.email)}
            />
            {errors.email && <p id="cm-email-err" role="alert" className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="cm-message" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">PESAN *</label>
            <textarea
              id="cm-message" name="message" rows={4} autoComplete="off" enterKeyHint="enter"
              maxLength={MAX.message} required
              aria-invalid={!!errors.message}
              aria-describedby={`cm-count${errors.message ? ' cm-message-err' : ''}`}
              value={form.message}
              onChange={setField('message')}
              placeholder="Tulis pesan Anda di sini..."
              className={`${inputCls(errors.message)} resize-none`}
            />
            <div className="flex items-start justify-between gap-3 mt-1">
              <div className="min-h-[1rem]">
                {errors.message && <p id="cm-message-err" role="alert" className="text-red-400 text-xs">{errors.message}</p>}
              </div>
              <p id="cm-count" className={`text-xs font-mono shrink-0 ${left > MAX.message - 40 ? 'text-amber-400' : 'text-slate-400'}`}>
                {left}/{MAX.message}
              </p>
            </div>
          </div>

          {/* Jebakan bot: kolom tersembunyi, manusia tidak akan mengisinya */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label>Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <SwipeToSend
            onConfirm={send}
            disabled={cooldown > 0}
            disabledLabel={`Tunggu ${Math.ceil(cooldown / 1000)} dtk untuk kirim lagi`}
          />
          <p className="text-xs font-mono text-slate-400 text-center">Geser ke kanan, atau fokus ke tombol lalu tekan Enter</p>

          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role={notice.type === 'error' ? 'alert' : 'status'}
                className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border ${
                  notice.type === 'ok'
                    ? 'text-teal-300 bg-teal-500/10 border-teal-500/30'
                    : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                }`}
              >
                {notice.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                )}
                {notice.text}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Daftar komentar */}
      <div data-aos="fade-left">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-600 text-xl text-slate-200 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-400" aria-hidden="true" />
            Komentar
          </h3>
          <span className="font-mono text-xs text-teal-400 glass px-2.5 py-1 rounded-full border border-teal-500/20">
            {comments.length} komentar
          </span>
        </div>

        {loading ? (
          <Skeleton />
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div
            role="region"
            aria-label="Daftar komentar"
            tabIndex={0}
            className="max-h-[60vh] lg:max-h-[520px] overflow-y-auto pr-1 overscroll-contain"
          >
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {comments.map((comment, i) => (
                  <CommentItem key={comment.id} comment={comment} index={i} now={now} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
