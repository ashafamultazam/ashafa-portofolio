import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import {
  SiPostgresql, SiGooglebigquery, SiPython, SiPandas, SiNumpy,
  SiGooglecolab, SiLooker, SiGithub,
} from 'react-icons/si'
import { FaDatabase, FaFileExcel, FaFilePowerpoint } from 'react-icons/fa'
import { PowerBiIcon, CanvaIcon, MatplotlibIcon } from './BrandIcons'
import { TECH_GROUPS, SOFT_SKILLS } from '../data/portfolio'
import './neon.css'

// Warna merek dipakai supaya logo mudah dikenali di background gelap.
const ICONS = {
  sql: { Icon: FaDatabase, color: '#38BDF8' },
  postgresql: { Icon: SiPostgresql, color: '#6B9BD1' },
  bigquery: { Icon: SiGooglebigquery, color: '#669DF6' },
  python: { Icon: SiPython, color: '#FFD43B' },
  pandas: { Icon: SiPandas, color: '#E6E6FA' },
  numpy: { Icon: SiNumpy, color: '#6FB7F0' },
  matplotlib: { Icon: MatplotlibIcon, neon: '#5B8DB8' },
  colab: { Icon: SiGooglecolab, color: '#F9AB00' },
  powerbi: { Icon: PowerBiIcon, neon: '#F2C811' },
  looker: { Icon: SiLooker, color: '#A78BFA' },
  excel: { Icon: FaFileExcel, color: '#21A366' },
  github: { Icon: SiGithub, color: '#F1F5F9' },
  powerpoint: { Icon: FaFilePowerpoint, color: '#F26B3A' },
  canva: { Icon: CanvaIcon, neon: '#00C4CC' },
}

function TechItem({ name, icon, index }) {
  const { Icon, color, neon } = ICONS[icon]
  const glow = neon || color || '#2DD4BF'

  // Posisi kursor disimpan sebagai variabel CSS, jadi cahaya neon mengikuti kursor tanpa re-render React
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -5 }}
      onPointerMove={onMove}
      style={{ '--neon': glow, '--d': `${(index % 5) * 0.6}s` }}
      className="neon-tile w-[104px] py-4 px-2 flex flex-col items-center gap-3"
    >
      {/* Ukuran sedang: 48px (w-12). Ubah ke w-10 (lebih kecil) atau w-14 (lebih besar) */}
      <Icon className="neon-icon w-12 h-12" style={color ? { color } : undefined} aria-hidden="true" />
      <span className="neon-label text-xs sm:text-[13px] text-slate-300 text-center leading-tight font-medium">
        {name}
      </span>
    </motion.li>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section-base relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/3 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">02 / SKILLS</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Keahlian & Teknologi</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        {/* Logo teknologi per kategori */}
        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-10">
          {TECH_GROUPS.map(({ title, items }) => (
            <div key={title} data-aos="fade-up">
              <h3 className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-4 text-center sm:text-left">
                {title}
              </h3>
              <ul className="flex flex-wrap justify-center sm:justify-start gap-3">
                {items.map((item, i) => (
                  <TechItem key={item.name} {...item} index={i} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Soft skills */}
        <div className="mt-12" data-aos="fade-up">
          <h3 className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-4 text-center sm:text-left">
            Soft Skills
          </h3>
          <ul className="flex flex-wrap justify-center sm:justify-start gap-2.5">
            {SOFT_SKILLS.map((s) => (
              <li
                key={s}
                className="glass rounded-full px-4 py-1.5 text-sm text-amber-400 border border-amber-500/20"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
