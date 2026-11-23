import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'
import SwipeToSend from './SwipeToSend'
import { CommentList, useComments, checkComment, COMMENT_MAX, NAME_MAX } from './Comments'
import { PERSONAL, GMAIL_LINK } from '../data/portfolio'

// text-base di HP (16px) mencegah iOS Safari memperbesar layar otomatis saat kolom difokuskan
const field = (err) =>
  `w-full bg-navy-900/50 rounded-lg px-3 py-2.5 text-base sm:text-sm text-slate-200 placeholder-slate-500 border transition-colors outline-none focus:border-teal-500/60 focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)] ${
    err ? 'border-red-500/40' : 'border-slate-700/40'
  }`

export default function Contact() {
  const [form, setForm] = useState({ name: '', message: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null) // { type: 'ok' | 'error', text }
  const { comments, loading, cooldown, post } = useComments()
  const honeypot = useRef(null)

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 7000)
    return () => clearTimeout(t)
  }, [notice])

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er))
  }

  const validate = () => {
    const e = checkComment(form)
    setErrors(e)
    const first = ['name', 'message'].find((k) => e[k])
    if (first) document.getElementById(`cm-${first}`)?.focus()
    return Object.keys(e).length === 0
  }

  // Dipanggil oleh tombol geser; true = berhasil
  const send = async () => {
    setNotice(null)
    if (!validate()) return false
    if (honeypot.current?.value) return true // bot mengisi kolom tersembunyi: pura-pura sukses
    try {
      await post({ name: form.name, message: form.message })
      setForm({ name: '', message: '' })
      setErrors({})
      setNotice({ type: 'ok', text: 'Terima kasih! Komentar Anda terkirim dan akan tampil untuk semua pengunjung setelah disetujui.' })
      return true
    } catch (err) {
      console.warn('Komentar gagal dikirim:', err?.message || err)
      const tooMany = /terlalu banyak|tautan/i.test(err?.message || '')
      setNotice({ type: 'error', text: tooMany ? 'Komentar ditolak. Coba lagi beberapa saat lagi.' : 'Komentar belum bisa dikirim. Periksa koneksi lalu coba lagi.' })
      return false
    }
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: PERSONAL.email, href: GMAIL_LINK, color: 'teal' },
    { icon: Phone, label: 'WhatsApp', value: PERSONAL.phone, href: `https://wa.me/${PERSONAL.phone.replace(/\D/g, '')}`, color: 'teal' },
    { icon: MapPin, label: 'Lokasi', value: PERSONAL.location, href: null, color: 'amber' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Ashafamultazam', href: PERSONAL.linkedin, color: 'teal' },
    { icon: Github, label: 'GitHub', value: 'Ashafamultazam', href: PERSONAL.github, color: 'amber' },
  ]

  return (
    <section className="section-base relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-3xl -translate-x-1/2" aria-hidden="true" />

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

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Kiri: info kontak */}
          <div data-aos="fade-right">
            <p className="text-slate-400 leading-relaxed mb-8">
              Tertarik bekerja sama atau punya pertanyaan tentang data analysis?
              Jangan ragu menghubungi saya — saya selalu terbuka untuk diskusi,
              kolaborasi, dan peluang baru.
            </p>

            <div className="space-y-4 mb-8">
              {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div key={label} whileHover={{ x: 4 }} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      color === 'teal' ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${color === 'teal' ? 'text-teal-400' : 'text-amber-400'}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{label}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="text-slate-300 text-sm hover:text-teal-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <span className="text-slate-300 text-sm">{value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

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

          {/* Kanan: form komentar + daftar komentar (ringkas, bisa di-scroll) */}
          <div data-aos="fade-left" className="space-y-4">
            <form noValidate onSubmit={(e) => e.preventDefault()} className="glass rounded-xl border border-slate-700/30 p-5 space-y-3.5">
              <h3 className="font-display font-600 text-lg text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" aria-hidden="true" />
                Tinggalkan Komentar
              </h3>

              <div>
                <label htmlFor="cm-name" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">NAMA *</label>
                <input
                  id="cm-name" name="name" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next"
                  maxLength={NAME_MAX} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cm-name-err' : undefined}
                  value={form.name} onChange={setField('name')} placeholder="Nama Anda" className={field(errors.name)}
                />
                {errors.name && <p id="cm-name-err" role="alert" className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="cm-message" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">KOMENTAR *</label>
                <textarea
                  id="cm-message" name="message" rows={3} maxLength={COMMENT_MAX} required
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cm-message-err' : undefined}
                  value={form.message} onChange={setField('message')} placeholder="Tulis komentar Anda..."
                  className={`${field(errors.message)} resize-none`}
                />
                <div className="flex items-start justify-between gap-3 mt-1">
                  <div className="min-h-[1rem]">
                    {errors.message && <p id="cm-message-err" role="alert" className="text-red-400 text-xs">{errors.message}</p>}
                  </div>
                  {form.message.length > COMMENT_MAX - 80 && (
                    <p className="text-xs font-mono text-amber-400 shrink-0">{form.message.length}/{COMMENT_MAX}</p>
                  )}
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
                ariaLabel="Posting komentar"
                label="Geser untuk memposting"
                sendingLabel="Memposting…"
                doneLabel="Terposting!"
              />

              <AnimatePresence>
                {notice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    role={notice.type === 'error' ? 'alert' : 'status'}
                    className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm border ${
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

            {/* Daftar komentar: ringkas, scroll kalau banyak */}
            <div className="glass rounded-xl border border-slate-700/30 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-display font-600 text-base text-slate-100">Komentar</h3>
                <span className="font-mono text-xs text-teal-400 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  {comments.length}
                </span>
              </div>
              <CommentList comments={comments} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
