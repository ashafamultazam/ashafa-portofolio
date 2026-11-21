import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Hanya untuk perangkat dengan mouse/trackpad; layar sentuh & reduced-motion dilewati
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const dot = dotRef.current
    const ring = ringRef.current
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf = 0
    let running = false

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)${
        ring.classList.contains('hovering') ? ' scale(1.6)' : ''
      }`
      if (Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
        running = false // berhenti saat diam, hemat CPU
        return
      }
      raf = requestAnimationFrame(animateRing)
    }

    const moveCursor = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      if (!running) {
        running = true
        raf = requestAnimationFrame(animateRing)
      }
    }

    // Event delegation: elemen yang muncul belakangan (lazy) tetap terdeteksi
    const SEL = 'a, button, input, textarea, [data-hover]'
    const onOver = (e) => ring.classList.toggle('hovering', !!e.target.closest?.(SEL))

    document.documentElement.classList.add('has-custom-cursor')
    document.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  )
}
