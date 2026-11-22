import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, CheckCircle2 } from 'lucide-react'
import SwipeToSend from './SwipeToSend'
import { PERSONAL, GMAIL_LINK } from '../data/portfolio'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})

  const [notice, setNotice] = useState(null)

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
    if (!form.email.trim()) e.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Format email tidak valid'
    if (!form.message.trim()) e.message = 'Pesan wajib diisi'
    setErrors(e)
    const first = ['name', 'email', 'message'].find((k) => e[k])
    if (first) document.getElementById(`contact-${first}`)?.focus()
    return Object.keys(e).length === 0
  }

  // Satu-satunya form di halaman ini. Tidak butuh server:
  // - Desktop: membuka Gmail (tab baru) dengan isi yang sudah terisi
  // - HP: membuka aplikasi email bawaan (mailto)
  // Mau kirim langsung tanpa membuka email? Ganti dengan Web3Forms / Formspree / EmailJS.
  const send = async () => {
    setNotice(null)
    if (!validate()) return false
    const subject = form.subject.trim() || `Pesan dari ${form.name.trim()}`
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`
    const mailto = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) {
      window.location.href = mailto
      setNotice('Aplikasi email dibuka. Tekan Kirim di sana untuk menyelesaikan.')
    } else {
      const w = window.open(gmail, '_blank', 'noopener')
      if (!w) window.location.href = mailto // pop-up diblokir: pakai mailto
      setNotice('Gmail dibuka di tab baru. Tekan Kirim di sana untuk menyelesaikan.')
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
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">NAMA *</label>
                  <input
                    id="contact-name" name="name" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next"
                    maxLength={80} required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-err' : undefined}
                    value={form.name} onChange={setField('name')} placeholder="Nama Anda" className={field(errors.name)}
                  />
                  {errors.name && <p id="contact-name-err" role="alert" className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">EMAIL *</label>
                  <input
                    id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next"
                    maxLength={120} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-err' : undefined}
                    value={form.email} onChange={setField('email')} placeholder="email@contoh.com" className={field(errors.email)}
                  />
                  {errors.email && <p id="contact-email-err" role="alert" className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">SUBJEK</label>
                <input
                  id="contact-subject" name="subject" type="text" enterKeyHint="next" maxLength={120}
                  value={form.subject} onChange={setField('subject')} placeholder="Perihal pesan Anda" className={field(false)}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5 tracking-wide">PESAN *</label>
                <textarea
                  id="contact-message" name="message" rows={5} maxLength={1000} required
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-message-err' : undefined}
                  value={form.message} onChange={setField('message')} placeholder="Tulis pesan Anda..."
                  className={`${field(errors.message)} resize-none`}
                />
                {errors.message && <p id="contact-message-err" role="alert" className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              <SwipeToSend
                onConfirm={send}
                ariaLabel="Kirim pesan"
                label="Geser untuk mengirim pesan"
                sendingLabel="Membuka email…"
                doneLabel="Email dibuka"
              />
              <p className="text-xs font-mono text-slate-400 text-center">Geser ke kanan, atau fokus ke tombol lalu tekan Enter</p>

              <AnimatePresence>
                {notice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    role="status"
                    className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm border text-teal-300 bg-teal-500/10 border-teal-500/30"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    {notice}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
