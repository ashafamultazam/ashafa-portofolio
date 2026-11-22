import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Music2, X, ExternalLink } from 'lucide-react'
import { MUSIC } from '../data/portfolio'
import './music.css'

// Ubah link Spotify biasa menjadi link embed (playlist, album, lagu, podcast)
function toEmbed(url = '') {
  const m = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|episode|show|artist)\/([A-Za-z0-9]+)/)
  if (!m) return null
  return {
    src: `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`,
    height: m[1] === 'track' || m[1] === 'episode' ? 152 : 352,
  }
}

export default function MusicPopup() {
  const embed = toEmbed(MUSIC.url)
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false) // iframe baru dibuat saat pertama dibuka (hemat kuota & skor performa)
  const [hint, setHint] = useState(false) // gelembung petunjuk, muncul sekali per sesi
  const toggleRef = useRef(null)
  const closeRef = useRef(null)
  const reduce = useReducedMotion()

  const openPanel = () => {
    setLoaded(true)
    setHint(false)
    setOpen(true)
  }

  // Munculkan petunjuk "Putar musik" sekali (2,5 dtk setelah halaman dibuka), hilang sendiri setelah 6 dtk
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('music-hint') === '1' } catch { /* abaikan */ }
    if (seen) return
    const show = setTimeout(() => {
      setHint(true)
      try { sessionStorage.setItem('music-hint', '1') } catch { /* abaikan */ }
    }, 2500)
    const hide = setTimeout(() => setHint(false), 8500)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])
  const closePanel = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  // Esc menutup panel. Musik tetap jalan karena iframe tidak dilepas, hanya disembunyikan
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closePanel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!embed) return null // belum diisi => tidak tampil apa-apa

  return (
    <>
      <motion.div
        id="music-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Pemutar musik Spotify"
        aria-hidden={!open}
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, scale: 1, x: 0, visibility: 'visible' },
          closed: { opacity: 0, scale: 0.4, x: 60, transitionEnd: { visibility: 'hidden' } },
        }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
        style={{ transformOrigin: 'bottom right' }}
        className="music-panel fixed z-[60] right-3 bottom-[10rem] w-[min(380px,calc(100vw-1.5rem))] rounded-2xl p-4"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-display font-800 text-xl leading-tight text-slate-100">{MUSIC.heading1}</p>
            <p className="font-display font-800 text-xl leading-tight text-teal-400">{MUSIC.heading2}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closePanel}
            aria-label="Ciutkan pemutar musik"
            className="w-11 h-11 -mt-1 -mr-1 shrink-0 flex items-center justify-center rounded-full text-slate-300 hover:text-teal-400 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-3">{MUSIC.description}</p>

        {loaded && (
          <iframe
            title={`Pemutar Spotify: ${MUSIC.label}`}
            src={embed.src}
            width="100%"
            height={embed.height}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-xl border-0 bg-navy-800 block"
          />
        )}

        <a
          href={MUSIC.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 min-h-11 text-xs font-mono text-teal-400 hover:underline"
        >
          {MUSIC.label} <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </motion.div>

      {/* Gelembung petunjuk (dekoratif) */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={hint && !open ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
        transition={{ duration: reduce ? 0 : 0.35 }}
        style={{ pointerEvents: 'none' }}
        className="fixed z-[60] right-14 bottom-[6.9rem] glass rounded-full px-3 py-1.5 text-xs font-mono text-teal-300 border border-teal-500/30 whitespace-nowrap"
      >
        Putar musik ♪
      </motion.div>

      {/* Tab kecil menempel di tepi kanan layar (tidak makan tempat) */}
      <button
        ref={toggleRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        title={open ? 'Ciutkan pemutar musik' : 'Putar musik'}
        aria-label={open ? 'Ciutkan pemutar musik' : 'Buka pemutar musik'}
        aria-expanded={open}
        aria-controls="music-panel"
        className="music-tab fixed z-[60] right-0 bottom-24 w-12 h-14 rounded-l-2xl flex items-center justify-center text-teal-400"
      >
        <Music2 className="w-5 h-5" aria-hidden="true" />
      </button>
    </>
  )
}
