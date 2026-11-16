import { motion } from 'framer-motion'
import { User, Download, Mail, CheckCircle2 } from 'lucide-react'
import { PERSONAL, EDUCATION, CERTIFICATIONS, PROJECTS } from '../data/portfolio'

/* ── EDIT HERE ──────────────────────────────────────────────
   Photo and CV files live in the /public folder.
   File names are case-sensitive on GitHub Pages.

   PHOTO_SHAPE:
     'arch'   → top rounded like a doorway (default)
     'circle' → round photo
     'cutout' → no frame; use a PNG with transparent background */
const PHOTO_FILE = 'AshafaMultazam.jpg'
const PHOTO_SHAPE = 'arch'
const CV_FILE = 'CV-Ashafa-Multazam.pdf'
const HEADLINE = 'Mengubah data mentah menjadi keputusan yang bisa ditindaklanjuti.'
/* ─────────────────────────────────────────────────────────── */

const SHAPES = {
  arch: { box: 'aspect-[4/5] rounded-t-[9rem] rounded-b-3xl', framed: true },
  circle: { box: 'aspect-square rounded-full', framed: true },
  cutout: { box: 'aspect-[4/5]', framed: false },
}
const shape = SHAPES[PHOTO_SHAPE] || SHAPES.arch
const fadeMask = 'linear-gradient(to bottom, #000 80%, transparent 100%)'

const BASE = import.meta.env.BASE_URL
const edu = EDUCATION[0]
const studentWord = edu.status === 'Lulus' ? 'lulusan' : 'mahasiswa'

// Hl = key fact (white), Ac = institution / role (teal)
const Hl = ({ children }) => <span className="text-slate-100 font-medium">{children}</span>
const Ac = ({ children }) => <span className="text-teal-400 font-medium">{children}</span>

const highlights = [
  `${edu.degree} di ${edu.institution}, IPK ${edu.gpa}`,
  `${PROJECTS.length} proyek analisis data dengan SQL, Python, dan visualisasi`,
  `${CERTIFICATIONS.length} pelatihan dan sertifikasi di bidang data dan AI`,
  'Terbuka untuk magang dan posisi entry-level Data Analyst',
]

const stats = [
  { value: edu.gpa, label: 'IPK' },
  { value: PROJECTS.length, label: 'Proyek' },
  { value: CERTIFICATIONS.length, label: 'Sertifikasi' },
]

export default function About() {
  const photoSrc = `${BASE}${PHOTO_FILE}`

  return (
    <section id="about" className="section-base relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/4 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* One centered block (58rem = photo 18rem + gap 4rem + text 36rem) */}
        <div className="max-w-[58rem] mx-auto">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-14" data-aos="fade-right">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="font-mono text-xs text-teal-500 tracking-widest mb-0.5">01 / ABOUT</p>
              <h2 className="font-display font-700 text-3xl text-slate-100">Tentang Saya</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-500/20 to-transparent ml-4" />
          </div>

          <div className="grid lg:grid-cols-[18rem_minmax(0,36rem)] lg:justify-center gap-12 lg:gap-16 items-center">
            {/* Left: photo */}
            <div data-aos="fade-right" data-aos-delay="100" className="flex flex-col items-center">
              <div className={`relative w-64 sm:w-72 ${shape.box}`}>
                {shape.framed ? (
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-teal-500/30 glow-teal-sm bg-navy-800">
                    <img
                      src={photoSrc}
                      alt={`Foto ${PERSONAL.name}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-x-4 top-12 bottom-0 rounded-full bg-teal-500/20 blur-3xl" />
                    <img
                      src={photoSrc}
                      alt={`Foto ${PERSONAL.name}`}
                      className="relative w-full h-full object-contain object-bottom"
                      style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
                    />
                  </>
                )}

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 -right-4 glass rounded-lg px-3 py-1.5 border border-teal-500/20"
                >
                  <span className="font-mono text-xs text-teal-400">IPK {edu.gpa} ⭐</span>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-10 -left-4 glass rounded-lg px-3 py-1.5 border border-amber-500/20"
                >
                  <span className="font-mono text-xs text-amber-400">{PERSONAL.title} 📊</span>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-10 w-64 sm:w-72">
                {stats.map(({ value, label }) => (
                  <div key={label} className="glass rounded-xl py-3 text-center">
                    <div className="font-display font-700 text-xl gradient-text">{value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: story */}
            <div data-aos="fade-left" data-aos-delay="200">
              <h3 className="font-display font-700 text-2xl lg:text-3xl text-slate-100 leading-tight mb-5">
                {HEADLINE}
              </h3>

              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Saya <Hl>{PERSONAL.name}</Hl>, {studentWord} <Ac>{edu.degree}</Ac> di{' '}
                  <Ac>{edu.institution}</Ac> yang berfokus pada <Hl>analisis data</Hl> dan{' '}
                  <Hl>machine learning</Hl>. Saya terbiasa mengolah data mentah, mulai dari
                  pembersihan data dan <Hl>query SQL</Hl> hingga visualisasi, agar hasilnya mudah
                  dipahami oleh orang yang mengambil keputusan.
                </p>
                <p>
                  Saya belajar lewat <Hl>proyek nyata</Hl> dan pelatihan, dan senang{' '}
                  <Hl>bekerja dalam tim</Hl>. Pengalaman organisasi melatih saya berkomunikasi dan
                  berkoordinasi dengan banyak pihak. Saat ini saya mencari kesempatan{' '}
                  <Ac>magang</Ac> atau posisi <Ac>entry-level</Ac> sebagai <Ac>Data Analyst</Ac>.
                </p>
              </div>

              <ul className="space-y-3 mt-7">
                {highlights.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 mt-8">
                <a href={`${BASE}${CV_FILE}`} download className="btn-primary">
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
                <a href="#contact" className="btn-outline">
                  <Mail className="w-4 h-4" />
                  Hubungi Saya
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
