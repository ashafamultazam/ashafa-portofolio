import { useEffect, useRef, useState } from 'react'
import { Briefcase, Users, MapPin } from 'lucide-react'
import { ORGANIZATIONS, PROFESSIONAL_EXPERIENCE } from '../data/portfolio'

/**
 * Timeline bernomor. Item yang dihover/disentuh/difokus menjadi terang, yang lain meredup.
 * Kalau item banyak, daftar bisa di-scroll ke bawah (ada pudar di tepi bawah sebagai petunjuk).
 */

function TimelineItem({ n, active, last, onActivate, item }) {
  return (
    <li
      onPointerEnter={onActivate}
      onClick={onActivate}
      data-active={active}
      className={`relative grid grid-cols-[2.75rem_1fr] gap-x-4 pb-8 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-55'
      } ${last ? 'pb-2' : ''}`}
    >
      {/* garis penghubung antar nomor */}
      {!last && (
        <span aria-hidden="true" className="absolute left-[1.375rem] top-12 bottom-0 w-px bg-slate-600/60" />
      )}

      {/* nomor */}
      <span
        aria-hidden="true"
        className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-display font-700 text-base transition-all duration-300 ${
          active
            ? 'bg-white text-navy-900 shadow-[0_0_0_4px_rgba(255,255,255,0.12),0_0_24px_rgba(45,212,191,0.45)]'
            : 'bg-navy-800 text-slate-300 border border-slate-600/70'
        }`}
      >
        {n}
      </span>

      <div className="min-w-0">
        {/* baris 1: ikon + instansi + periode */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0"
            >
              {item.icon || '💼'}
            </span>
            <h4 className="font-display font-700 text-lg text-slate-50 leading-tight">{item.name}</h4>
          </div>
          <span className="font-mono text-xs text-slate-300 border border-slate-600/70 rounded-full px-3 py-1 whitespace-nowrap">
            {item.period}
          </span>
        </div>

        {/* baris 2: jabatan */}
        <p className="font-display font-700 text-xl text-white mt-3 leading-snug">{item.role}</p>

        {/* baris 3: lokasi + label */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-300">
          {item.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {item.location}
            </span>
          )}
          {item.tag && (
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300">
              {item.tag}
            </span>
          )}
        </div>

        {/* rincian kegiatan */}
        {item.points?.length > 0 && (
          <ul className="mt-4 space-y-1.5 pl-3 border-l border-teal-500/30">
            {item.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-teal-400 mt-2 shrink-0" aria-hidden="true" />
                <span className="text-slate-300 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function Timeline({ icon: Icon, title, label, items }) {
  const [active, setActive] = useState(0)
  const [more, setMore] = useState(false) // masih ada isi di bawah yang belum terlihat
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 12)
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = 'ResizeObserver' in window ? new ResizeObserver(check) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', check)
      ro?.disconnect()
    }
  }, [items.length])

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-6">
        <Icon className="w-5 h-5 text-teal-400" aria-hidden="true" />
        <h3 className="font-display font-700 text-2xl text-slate-100">{title}</h3>
      </div>

      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="max-h-[560px] overflow-y-auto pr-2 pl-2 -ml-2"
        style={
          more
            ? { WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 56px), transparent)', maskImage: 'linear-gradient(to bottom, #000 calc(100% - 56px), transparent)' }
            : undefined
        }
      >
        <ol>
          {items.map((item, i) => (
            <TimelineItem
              key={`${item.role}-${i}`}
              n={i + 1}
              item={item}
              active={active === i}
              last={i === items.length - 1}
              onActivate={() => setActive(i)}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function Experience() {
  // Samakan bentuk data profesional & organisasi
  const pro = PROFESSIONAL_EXPERIENCE.map((e) => ({
    name: e.company,
    role: e.role,
    tag: e.type,
    location: e.location,
    period: e.period,
    icon: e.icon,
    points: e.points,
  }))
  const org = ORGANIZATIONS.map((o) => ({
    name: o.org,
    role: o.role,
    location: o.location,
    period: o.period,
    icon: o.icon,
    points: o.events,
  }))
  const hasPro = pro.length > 0
  const hasOrg = org.length > 0

  return (
    <section id="experience" className="section-base relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-teal-500/4 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">06 / EXPERIENCE</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Pengalaman</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        <div className={`grid gap-12 items-start ${hasPro && hasOrg ? 'lg:grid-cols-2' : 'max-w-3xl'}`} data-aos="fade-up">
          {hasPro && <Timeline icon={Briefcase} title="Pengalaman Profesional" label="Daftar pengalaman profesional" items={pro} />}
          {hasOrg && <Timeline icon={Users} title="Pengalaman Organisasi" label="Daftar pengalaman organisasi" items={org} />}
        </div>
      </div>
    </section>
  )
}
