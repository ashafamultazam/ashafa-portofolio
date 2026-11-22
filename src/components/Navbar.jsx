import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Database } from 'lucide-react'
import { GMAIL_LINK } from '../data/portfolio'

const navItems = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Tentang', href: '#about' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Pendidikan', href: '#education' },
  { label: 'Sertifikasi', href: '#certifications' },
  { label: 'Proyek', href: '#projects' },
  { label: 'Pengalaman', href: '#experience' },
  { label: 'Kontak', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#hero')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Scroll-spy pakai IntersectionObserver (tanpa membaca offsetTop => tidak ada forced reflow)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1))
      if (el) io.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  // Tutup menu mobile dengan tombol Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.nav
      aria-label="Navigasi utama"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-teal-500/10 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-12 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => setOpen(false)}
          aria-label="Ashafa Multazam, kembali ke beranda"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center group-hover:border-teal-400 transition-colors">
            <Database className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
          </div>
          <span className="font-display font-700 text-[13px] text-slate-100 hidden sm:block">
            Ashafa<span className="text-teal-400">.dev</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              aria-current={active === href ? 'true' : undefined}
              className={`nav-link !text-[0.78rem] ${active === href ? 'active' : ''}`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={GMAIL_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-primary justify-center !py-1.5 !px-4 !text-[13px]"
          >
            Hubungi Saya
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded border border-teal-500/20 text-teal-400 hover:border-teal-400 transition-colors"
        >
          {open ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden glass border-t border-teal-500/10"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active === href ? 'true' : undefined}
                  className={`text-left py-2.5 px-3 rounded text-sm font-body font-500 transition-colors ${
                    active === href
                      ? 'text-teal-400 bg-teal-500/5'
                      : 'text-slate-400 hover:text-teal-400'
                  }`}
                >
                  {label}
                </a>
              ))}
              <a
                href={GMAIL_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs py-2 px-4 justify-center mt-2"
              >
                Hubungi Saya
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
