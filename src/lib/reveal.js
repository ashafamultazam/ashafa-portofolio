// Pengganti library AOS: animasi muncul saat di-scroll memakai IntersectionObserver.
// Tidak membaca layout (offsetTop dll.), jadi tidak memicu "forced reflow".
// Pakai atribut yang sama: data-aos="fade-up|fade-left|fade-right" dan data-aos-delay="200".
export function initReveal(root = document.body) {
  if (!('IntersectionObserver' in window)) {
    root.querySelectorAll('[data-aos]').forEach((el) => el.classList.add('aos-animate'))
    return () => {}
  }

  const seen = new WeakSet()
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate')
          io.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.05 },
  )

  let queued = false
  const scan = () => {
    queued = false
    root.querySelectorAll('[data-aos]').forEach((el) => {
      if (seen.has(el)) return
      seen.add(el)
      const delay = el.getAttribute('data-aos-delay')
      if (delay) el.style.setProperty('--aos-delay', `${delay}ms`)
      io.observe(el)
    })
  }

  scan()
  // Komponen yang dimuat belakangan (lazy) ikut dipantau
  const mo = new MutationObserver(() => {
    if (!queued) {
      queued = true
      requestAnimationFrame(scan)
    }
  })
  mo.observe(root, { childList: true, subtree: true })

  return () => {
    io.disconnect()
    mo.disconnect()
  }
}
