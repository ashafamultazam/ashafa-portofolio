import { motion } from 'framer-motion'
import { Award, Calendar, Tag, ExternalLink } from 'lucide-react'
import { CERTIFICATIONS } from '../data/portfolio'
import PdfThumb from './PdfThumb'

const platformCount = new Set(CERTIFICATIONS.map((c) => c.issuer)).size

export default function Certifications() {
  return (
    <section id="certifications" className="section-base relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-teal-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">04 / CERTIFICATIONS</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Pelatihan & Sertifikasi</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, i) => {
            const Card = cert.link ? motion.a : motion.div
            const linkProps = cert.link
              ? {
                  href: cert.link,
                  target: '_blank',
                  rel: 'noreferrer',
                  'aria-label': `Buka sertifikat ${cert.title} dari ${cert.issuer} (PDF, tab baru)`,
                }
              : {}
            const accent = cert.color === 'teal' ? 'teal' : 'amber'

            return (
              <Card
                key={cert.title}
                {...linkProps}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                className={`block glass glass-hover card-lift rounded-xl border overflow-hidden relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400 ${
                  cert.highlight ? 'border-teal-500/30' : 'border-slate-700/30'
                }`}
              >
                {/* Thumbnail sertifikat */}
                <div className="relative">
                  <PdfThumb item={cert} emoji={cert.badge} label="SERTIFIKAT" cta="Lihat sertifikat" />
                  {cert.highlight && (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 glass rounded-full px-2.5 py-0.5 text-xs font-mono text-teal-400 border border-teal-500/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {/* Judul + penerbit */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl leading-none mt-0.5" aria-hidden="true">{cert.badge}</span>
                      <div className="min-w-0">
                        <h3 className="font-display font-700 text-base text-slate-100 leading-tight">
                          {cert.title}
                        </h3>
                        <p className={`text-sm mt-1 font-medium ${accent === 'teal' ? 'text-teal-400' : 'text-amber-400'}`}>
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                    {cert.link && (
                      <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-slate-400 group-hover:text-teal-400 transition-colors" aria-hidden="true" />
                    )}
                  </div>

                  {/* Tanggal */}
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    <span className="font-mono">{cert.period}</span>
                  </div>

                  {/* Topik */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-slate-400" aria-hidden="true" />
                    {cert.topics.map((topic) => (
                      <span
                        key={topic}
                        className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${
                          accent === 'teal'
                            ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Ajakan klik, selalu terlihat (di HP tidak ada hover) */}
                  {cert.link && (
                    <p className="mt-5 text-xs font-mono text-teal-400 group-hover:underline">
                      Lihat sertifikat (PDF) →
                    </p>
                  )}
                </div>

                {/* Garis aksen bawah */}
                <div
                  className={`h-0.5 ${
                    accent === 'teal'
                      ? 'bg-gradient-to-r from-teal-500/50 via-teal-500/20 to-transparent'
                      : 'bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent'
                  }`}
                />
              </Card>
            )
          })}
        </div>

        {/* Stats bar: angka diturunkan dari data (dulu hardcode "12+ sertifikat" & "3 platform") */}
        <motion.div
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-10 glass rounded-xl border border-teal-500/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { label: 'Total Sertifikat', value: String(CERTIFICATIONS.length), icon: '🏅' },
            { label: 'Jam Pelatihan', value: '200+', icon: '⏱️' },
            { label: 'Platform', value: String(platformCount), icon: '🖥️' },
            { label: 'Tahun Belajar', value: '2+', icon: '📅' },
          ].map(({ label, value, icon }) => (
            <div key={label}>
              <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
              <div className="font-display font-700 text-2xl text-teal-400">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
