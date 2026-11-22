import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'
import SwipeToSend from './SwipeToSend'
import { CommentList, useComments, COMMENT_MAX } from './Comments'
import { PERSONAL, GMAIL_LINK } from '../data/portfolio'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [mode, setMode] = useState('message') // 'message' = email pribadi, 'comment' = komentar publik
  const { comments, loading, cooldown, post } = useComments()
  const honeypot = useRef(null)
  const isComment = mode === 'comment'

  const [notice, setNotice] = useState(null) // { type: 'ok' | 'error', text }

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 8000)
    return () => clearTimeout(t)
  }, [notice])

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (isComment) {
      if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Format email tidak valid'
      if (form.message.trim().length < 5) e.message = form.message.trim() ? 'Komentar terlalu singkat (min. 5 karakter)' : 'Komentar wajib diisi'
    } else {
      if (!form.email.trim()) e.email = 'Email wajib diisi'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Format email tidak valid'
      if (!form.message.trim()) e.message = 'Pesan wajib diisi'
    }
    setErrors(e)
    const first = ['name', 'email', 'message'].find((k) => e[k])
    if (first) document.getElementById(`contact-${first}`)?.focus()
    return Object.keys(e).length === 0
  }

  const chooseMode = (m) => {
    setMode(m)
    setErrors({})
    setNotice(null)
  }
  const onModeKey = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
      chooseMode(mode === 'message' ? 'comment' : 'message')
      document.getElementById(`mode-${mode === 'message' ? 'comment' : 'message'}`)?.focus()
    }
  }

  // Komentar publik: disimpan ke Supabase dan langsung tampil di daftar "Komentar" di bawah
  const sendComment = async () => {
    if (honeypot.current?.value) return true // bot mengisi kolom tersembunyi: pura-pura sukses
    try {
      await post({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() })
      setForm({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setNotice({ type: 'ok', text: 'Terima kasih! Komentar Anda sudah tampil di bagian Komentar di bawah.' })
      return true
    } catch (err) {
      console.warn('Komentar gagal dikirim:', err?.message || err)
      setNotice({ type: 'error', text: 'Komentar belum bisa dikirim. Periksa koneksi lalu coba lagi.' })
      return false
    }
  }

  // Satu-satunya form di halaman ini. Tidak butuh server:
  // - Desktop: membuka Gmail (tab baru) dengan isi yang sudah terisi
  // - HP: membuka aplikasi email bawaan (mailto)
  // Mau kirim langsung tanpa membuka email? Ganti dengan Web3Forms / Formspree / EmailJS.
  const send = async () => {
    setNotice(null)
    if (!validate()) return false
    if (isComment) return sendComment()
    const subject = form.subject.trim() || `Pesan dari ${form.name.trim()}`
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`
    const mailto = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) {
      window.location.href = mailto
      setNotice({ type: 'ok', text: 'Aplikasi email dibuka. Tekan Kirim di sana untuk menyelesaikan.' })
    } else {
      const w = window.open(gmail, '_blank', 'noopener')
      if (!w) window.location.href = mailto // pop-up diblokir: pakai mailto
      setNotice({ type: 'ok', text: 'Gmail dibuka di tab baru. Tekan Kirim di sana untuk menyelesaikan.' })
    }
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrors({})
    return true
  }

  // text-base di HP (16px) mencegah iOS Safari memperbesar layar otomatis saat kolom difokuskan
  const field = (err) =>
    `w-full bg-navy-900/50 rounded-lg px-3 py-3 text-base sm:text-sm text-slate-200 placeholder-slate-500 border transition-colors outline-none focus:border-teal-500/60 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)] ${
      err ? 'border-red-500/40' : 'border-slate-700/40'
    }`

  const contactItems = [
    { icon: Mail, label: 'Email', value: PERSONAL.email, href: GMAIL_LINK, color: 'teal' },
    { icon: Phone, label: 'WhatsApp', value: PERSONAL.phone, href: `https://wa.me/${PERSONAL.phone.replace(/\D/g, '')}`, color: 'teal' },
    { icon: MapPin, label: 'Lokasi', value: PERSONAL.location, href: null, color: 'amber' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Ashafamultazam', href: PERSONAL.linkedin, color: 'teal' },
    { icon: Github, label: 'GitHub', value: 'Ashafamultazam', href: PERSONAL.github, color: 'amber' },
  ]

  return (
    <section className="section-base relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-3xl -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">07 / CONTACT</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Hubungi Saya</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div data-aos="fade-right">
            <p className="text-slate-400 leading-relaxed mb-8">
              Tertarik bekerja sama atau punya pertanyaan tentang data analysis? 
              Jangan ragu menghubungi saya — saya selalu terbuka untuk diskusi, 
              kolaborasi, dan peluang baru.
            </p>

            <div className="space-y-4 mb-8">
              {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    color === 'teal'
                      ? 'bg-teal-500/10 border border-teal-500/20'
                      : 'bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    <Icon className={`w-4 h-4 ${color === 'teal' ? 'text-teal-400' : 'text-amber-400'}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer"
                        className="text-slate-300 text-sm hover:text-teal-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <span className="text-slate-300 text-sm">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Availability badge */}
            <div className="glass rounded-xl p-4 border border-teal-500/15">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="font-mono text-xs text-teal-400 tracking-widest">TERSEDIA UNTUK HIRE</span>
              </div>
              <p className="text-slate-400 text-xs">
                Terbuka untuk posisi Data Analyst, Junior Data Scientist, atau peran terkait data.
                Tersedia untuk full-time maupun freelance.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div data-aos="fade-left">
            <form noValidate onSubmit={(e) => e.preventDefault()} className="glass rounded-xl border border-slate-700/30 p-6 space-y-4">
              {/* Satu form, dua tujuan */}
              <div role="radiogroup" aria-label="Jenis pesan" onKeyDown={onModeKey}
                className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-navy-900/60 border border-slate-700/40">
                {[
                  { id: 'message', label: 'Pesan pribadi', icon: Mail },
                  { id: 'comment', label: 'Komentar publik', icon: MessageSquare },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id} id={`mode-${id}`} type="button" role="radio"
                    aria-checked={mode === id} tabIndex={mode === id ? 0 : -1}
                    onClick={() => chooseMode(id)}
                    className={`flex items-center justify-center gap-2 min-h-11 rounded-md text-sm font-medium transition-colors ${
                      mode === id
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-[0_0_14px_rgba(45,212,191,0.18)]'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" /> {label}
                  </button>
                ))}
              </div>

              <div className={`grid gap-4 ${isComment ? '' : 'sm:grid-cols-2'}`}>
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">NAMA *</label>
                  <input
                    id="contact-name" name="name" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next"
                    maxLength={60} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-err' : undefined}
                    value={form.name} onChange={setField('name')} placeholder="Nama Anda" className={field(errors.name)}
                  />
                  {errors.name && <p id="contact-name-err" role="alert" className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">
                    {isComment ? 'EMAIL (opsional, tidak ditampilkan)' : 'EMAIL *'}
                  </label>
                  <input
                    id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next"
                    maxLength={120} required={!isComment} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-err' : undefined}
                    value={form.email} onChange={setField('email')} placeholder="email@contoh.com" className={field(errors.email)}
                  />
                  {errors.email && <p id="contact-email-err" role="alert" className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {!isComment && (
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">SUBJEK</label>
                  <input
                    id="contact-subject" name="subject" type="text" enterKeyHint="next" maxLength={120}
                    value={form.subject} onChange={setField('subject')} placeholder="Perihal pesan Anda" className={field(false)}
                  />
                </div>
              )}

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">
                  {isComment ? 'KOMENTAR *' : 'PESAN *'}
                </label>
                <textarea
                  id="contact-message" name="message" rows={isComment ? 4 : 5} maxLength={isComment ? COMMENT_MAX : 1000} required
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-message-err' : undefined}
                  value={form.message} onChange={setField('message')}
                  placeholder={isComment ? 'Tulis komentar Anda...' : 'Tulis pesan Anda...'}
                  className={`${field(errors.message)} resize-none`}
                />
                <div className="flex items-start justify-between gap-3 mt-1">
                  <div className="min-h-[1rem]">
                    {errors.message && <p id="contact-message-err" role="alert" className="text-red-400 text-xs">{errors.message}</p>}
                  </div>
                  {isComment && form.message.length > COMMENT_MAX - 80 && (
                    <p className="text-xs font-mono text-amber-400 shrink-0">{form.message.length}/{COMMENT_MAX}</p>
                  )}
                </div>
              </div>

              {/* Jebakan bot: kolom tersembunyi, manusia tidak akan mengisinya */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              <SwipeToSend
                key={mode}
                onConfirm={send}
                disabled={isComment && cooldown > 0}
                disabledLabel={`Tunggu ${Math.ceil(cooldown / 1000)} dtk untuk kirim lagi`}
                ariaLabel={isComment ? 'Posting komentar' : 'Kirim pesan'}
                label={isComment ? 'Geser untuk memposting komentar' : 'Geser untuk mengirim pesan'}
                sendingLabel={isComment ? 'Memposting…' : 'Membuka email…'}
                doneLabel={isComment ? 'Terposting!' : 'Email dibuka'}
              />

              <AnimatePresence>
                {notice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    role={notice.type === 'error' ? 'alert' : 'status'}
                    className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border ${
                      notice.type === 'ok'
                        ? 'text-teal-300 bg-teal-500/10 border-teal-500/30'
                        : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    {notice.type === 'ok'
                      ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                      : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />}
                    {notice.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Daftar komentar publik */}
        <div className="mt-16 pt-12 border-t border-slate-800" data-aos="fade-up">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="font-display font-700 text-2xl text-slate-100 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-teal-400" aria-hidden="true" />
              Komentar
            </h3>
            <span className="font-mono text-xs text-teal-400 glass px-2.5 py-1 rounded-full border border-teal-500/20">
              {comments.length} komentar
            </span>
          </div>
          <CommentList comments={comments} loading={loading} />
        </div>
      </div>
    </section>
  )
}
