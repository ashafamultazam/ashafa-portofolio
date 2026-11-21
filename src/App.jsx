import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { initReveal } from './lib/reveal'

import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Education from './components/Education'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Divider from './components/Divider'

// Contact memuat Supabase + SweetAlert (berat), jadi baru diunduh saat mendekati layar
const Contact = lazy(() => import('./components/Contact'))

function Defer({ id, minHeight = '70vh', children }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setShow(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div id={id} ref={ref} style={show ? undefined : { minHeight }}>
      {show && <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>}
    </div>
  )
}

export default function App() {
  useEffect(() => initReveal(), [])

  return (
    <div className="relative min-h-screen bg-navy-900">
      <a href="#main" className="skip-link">Lompat ke konten utama</a>
      <CustomCursor />
      <Navbar />

      <main id="main">
        <Hero />
        <Divider />
        <About />
        <Divider />
        <Skills />
        <Divider />
        <Education />
        <Divider />
        <Certifications />
        <Divider />
        <Projects />
        <Divider />
        <Experience />
        <Divider />
        <Defer id="contact">
          <Contact />
        </Defer>
      </main>

      <Footer />
    </div>
  )
}
