import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, ExternalLink, Github, Tag, FileText } from 'lucide-react'
import { PROJECTS, PERSONAL } from '../data/portfolio'

const BASE = import.meta.env.BASE_URL

// Pulls the file id out of a Google Drive link (…/d/FILE_ID/view or …?id=FILE_ID)
const driveId = (url = '') =>
  url.match(/\/d\/([\w-]+)/)?.[1] || url.match(/[?&]id=([\w-]+)/)?.[1] || null

// 1) your own image in /public/previews (most reliable)
// 2) otherwise Google's automatic thumbnail of the PDF's first page
function previewSrc(project) {
  if (project.preview) return `${BASE}previews/${project.preview}`
  const id = driveId(project.link)
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : null
}

function Thumb({ project }) {
  const [failed, setFailed] = useState(false)
  const src = previewSrc(project)

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-navy-800 border-b border-slate-700/30">
      {src && !failed ? (
        <img
          src={src}
          alt={`Pratinjau PDF ${project.title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-teal-500/10 to-amber-500/5">
          {project.icon}
        </div>
      )}

      {project.link && (
        <>
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded glass font-mono text-[10px] text-teal-400">
            PDF
          </span>
          <div className="absolute inset-0 flex items-end justify-end p-3 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md glass text-xs font-medium text-teal-300">
              <FileText className="w-3.5 h-3.5" />
              Buka PDF
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-base relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-teal-500/4 rounded-full blur-3xl -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">05 / PROJECTS</p>
            <h2 className="font-display font-700 text-3xl text-slate-100">Proyek</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => {
            const Card = project.link ? motion.a : motion.div
            const linkProps = project.link
              ? {
                  href: project.link,
                  target: '_blank',
                  rel: 'noreferrer',
                  'aria-label': `Buka PDF ${project.title}`,
                }
              : {}

            return (
              <Card
                key={project.title}
                {...linkProps}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="block glass glass-hover card-lift rounded-xl border border-slate-700/30 overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
              >
                <div className="h-1.5 bg-gradient-to-r from-teal-500 via-teal-400 to-amber-400 opacity-60" />

                <Thumb project={project} />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{project.icon}</span>
                      <div>
                        <h3 className="font-display font-700 text-base text-slate-100">{project.title}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 rounded text-xs font-mono text-teal-400">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    {project.link && (
                      <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-slate-600 group-hover:text-teal-400 transition-colors" />
                    )}
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-slate-600" />
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-navy-800/80 border border-slate-700/40 rounded text-xs font-mono text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10" data-aos="fade-up">
          <a href={PERSONAL.github} target="_blank" rel="noreferrer" className="btn-outline inline-flex">
            <Github className="w-4 h-4" />
            Lihat Semua di GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
