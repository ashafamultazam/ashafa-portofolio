import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, Calendar, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { CERTIFICATIONS } from '../data/portfolio'
import PdfThumb from './PdfThumb'
import './neon.css'

const BASE = import.meta.env.BASE_URL
// Nama file di folder public/previews/ (di GitHub: public/previews/...) diubah jadi alamat lengkap.
// Link lengkap (https://...) dibiarkan apa adanya.
const asset = (name) => (/^https?:\/\//i.test(name) ? name : `${BASE}previews/${encodeURIComponent(name)}`)

// Gambar kartu = `preview`. Yang dibuka saat kartu diklik = `file` (mis. PDF), kalau tidak ada maka gambar `preview` itu sendiri.
// `link` (alamat luar) tetap didukung sebagai cadangan.
function certSources(cert) {
  const thumb = cert.preview ? asset(cert.preview) : null
  const href = cert.file ? asset(cert.file) : thumb || cert.link || null
  return { thumb, href }
}
const NEON = { teal: '#2DD4BF', amber: '#FBBF24' }
const MAX_TOPICS = 4

function CertCard({ cert, offset, index, total, width, spacing, reduce, onSelect, wasDragged }) {
  const abs = Math.abs(offset)
  const active = offset === 0
  const neon = NEON[cert.color] || NEON.teal
  const { thumb, href } = certSources(cert)
  const Wrapper = active && href ? 'a' : 'div'
  const wrapperProps =
    active && href
      ? {
          href,
          target: '_blank',
          rel: 'noreferrer',
          'aria-label': `Buka sertifikat ${cert.title} dari ${cert.issuer} (tab baru)`,
          // klik setelah menggeser kartu tidak boleh membuka link
          onClick: (e) => wasDragged.current && e.preventDefault(),
          draggable: false,
        }
      : {}

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} dari ${total}`}
      aria-hidden={active ? undefined : true}
      initial={false}
      animate={{
        x: offset * spacing,
        scale: 1 - Math.min(abs, 3) * 0.13,
        rotateY: -Math.max(-1, Math.min(1, offset)) * 40,
        opacity: abs === 0 ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.22 : 0,
        filter: `brightness(${active ? 1 : 0.5}) saturate(${active ? 1 : 0.7})`,
      }}
      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }}
      style={{
        gridArea: '1 / 1',
        width,
        zIndex: 10 - abs,
        transformPerspective: 1300,
        pointerEvents: abs > 2 ? 'none' : 'auto',
        '--neon': neon,
      }}
      onClick={() => {
        if (!active && !wasDragged.current) onSelect()
      }}
      className="cert-card self-stretch will-change-transform"
      data-active={active}
    >
      <Wrapper {...wrapperProps} className="group flex flex-col h-full focus-visible:outline-offset-[-4px]">
        <PdfThumb src={thumb} title={cert.title} clickable={!!href} emoji={cert.badge} />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display font-700 text-base text-slate-100 leading-snug">{cert.title}</h3>
              <p className="text-sm mt-1 font-medium" style={{ color: neon }}>
                {cert.issuer}
              </p>
            </div>
            {cert.highlight && (
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-mono border"
                style={{ color: neon, borderColor: `${neon}55`, background: `${neon}14` }}
              >
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs mt-3">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span className="font-mono">{cert.period}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mt-4">
            {cert.topics.slice(0, MAX_TOPICS).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-xs font-mono border"
                style={{ color: neon, borderColor: `${neon}33`, background: `${neon}12` }}
              >
                {t}
              </span>
            ))}
            {cert.topics.length > MAX_TOPICS && (
              <span className="text-xs font-mono text-slate-400">+{cert.topics.length - MAX_TOPICS}</span>
            )}
          </div>

          {active && href && (
            <p className="mt-auto pt-5 text-xs font-mono flex items-center gap-1.5" style={{ color: neon }}>
              Lihat sertifikat <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </p>
          )}
        </div>
      </Wrapper>
    </motion.div>
  )
}

function CertCarousel() {
  const total = CERTIFICATIONS.length
  const startAt = Math.max(0, CERTIFICATIONS.findIndex((c) => c.highlight))
  const [index, setIndex] = useState(startAt)
  const [stageW, setStageW] = useState(960)
  const stageRef = useRef(null)
  const wasDragged = useRef(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = stageRef.current
    if (!el || !('ResizeObserver' in window)) return
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = useCallback((i) => setIndex(Math.max(0, Math.min(total - 1, i))), [total])
  const prev = () => go(index - 1)
  const next = () => go(index + 1)

  const width = Math.max(250, Math.min(430, stageW * 0.74))
  const spacing = width * 0.64

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'Home') { e.preventDefault(); go(0) }
    if (e.key === 'End') { e.preventDefault(); go(total - 1) }
  }

  const onDragEnd = (_, info) => {
    const { offset, velocity } = info
    if (offset.x < -60 || velocity.x < -500) next()
    else if (offset.x > 60 || velocity.x > 500) prev()
    setTimeout(() => { wasDragged.current = false }, 60)
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Pelatihan dan sertifikasi"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="rounded-xl focus-visible:outline-offset-4"
    >
      <p className="sr-only" aria-live="polite">
        Sertifikat {index + 1} dari {total}: {CERTIFICATIONS[index].title}
      </p>

      <div ref={stageRef} className="overflow-x-clip py-10">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => { wasDragged.current = true }}
          onDragEnd={onDragEnd}
          style={{ touchAction: 'pan-y' }}
          className="grid justify-items-center cursor-grab active:cursor-grabbing select-none"
        >
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard
              key={cert.title}
              cert={cert}
              index={i}
              total={total}
              offset={i - index}
              width={width}
              spacing={spacing}
              reduce={reduce}
              wasDragged={wasDragged}
              onSelect={() => go(i)}
            />
          ))}
        </motion.div>
      </div>

      {/* Kontrol: panah + titik (target sentuh 44px) */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Sertifikat sebelumnya"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-teal-500/25 text-teal-400 hover:border-teal-400 hover:shadow-[0_0_16px_rgba(45,212,191,0.35)] disabled:opacity-30 disabled:hover:shadow-none transition"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center">
          {CERTIFICATIONS.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => go(i)}
              aria-label={`Tampilkan sertifikat ${i + 1}: ${c.title}`}
              aria-current={i === index ? 'true' : undefined}
              className="w-9 h-11 flex items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 bg-teal-400 shadow-[0_0_10px_#2DD4BF]' : 'w-2 bg-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={index === total - 1}
          aria-label="Sertifikat berikutnya"
          className="w-11 h-11 flex items-center justify-center rounded-full border border-teal-500/25 text-teal-400 hover:border-teal-400 hover:shadow-[0_0_16px_rgba(45,212,191,0.35)] disabled:opacity-30 disabled:hover:shadow-none transition"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-base relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">04 / CERTIFICATIONS</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Pelatihan & Sertifikasi</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        <CertCarousel />
      </div>
    </section>
  )
}
