import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'
import { Send, Check, Loader2, ChevronsRight } from 'lucide-react'
import './swipe.css'

const HANDLE = 48 // diameter tombol geser (>= 44px untuk target sentuh)
const PAD = 4
const THRESHOLD = 0.82 // harus digeser sampai 82% jalur supaya terkirim

/**
 * Tombol "geser untuk mengirim".
 * - Mouse & layar sentuh: geser tombol ke kanan.
 * - Keyboard / pembaca layar / voice control: tekan Enter atau Spasi pada tombol (tanpa perlu menggeser).
 * - Ketuk biasa (tanpa geser) hanya memberi petunjuk, supaya tidak terkirim tak sengaja.
 *
 * onConfirm harus mengembalikan Promise<boolean> (true = berhasil terkirim).
 */
export default function SwipeToSend({
  onConfirm,
  disabled = false,
  label = 'Geser untuk mengirim',
  disabledLabel = 'Tunggu sebentar…',
  sendingLabel = 'Mengirim…',
  doneLabel = 'Terkirim!',
  ariaLabel = 'Kirim',
}) {
  const trackRef = useRef(null)
  const dragged = useRef(false)
  const mounted = useRef(true)
  const [maxX, setMaxX] = useState(220)
  const [status, setStatus] = useState('idle') // idle | sending | done
  const reduce = useReducedMotion()
  const x = useMotionValue(0)

  const fillWidth = useTransform(x, (v) => v + HANDLE + PAD * 2)
  const labelOpacity = useTransform(x, [0, maxX * 0.45], [1, 0])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el || !('ResizeObserver' in window)) return
    const ro = new ResizeObserver(([e]) => setMaxX(Math.max(60, e.contentRect.width - HANDLE - PAD * 2)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const back = () =>
    animate(x, 0, reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 30 })

  const confirm = async () => {
    if (status !== 'idle' || disabled) return
    setStatus('sending')
    animate(x, maxX, { duration: reduce ? 0 : 0.15 })
    let ok = false
    try {
      ok = await onConfirm()
    } catch {
      ok = false
    }
    if (!mounted.current) return
    if (ok) {
      setStatus('done')
      await new Promise((r) => setTimeout(r, 1600))
      if (!mounted.current) return
    }
    setStatus('idle')
    back()
  }

  const onDragEnd = () => {
    if (x.get() >= maxX * THRESHOLD) confirm()
    else back()
    setTimeout(() => { dragged.current = false }, 60)
  }

  const onClick = (e) => {
    if (dragged.current) return
    // Enter / Spasi / voice control / pembaca layar menghasilkan klik dengan detail === 0
    if (e.detail === 0) return confirm()
    // Ketukan biasa: goyang sedikit sebagai petunjuk "geser", tanpa mengirim
    if (status === 'idle' && !disabled) animate(x, [0, maxX * 0.22, 0], { duration: reduce ? 0 : 0.7 })
  }

  const busy = status !== 'idle'
  const text = disabled ? disabledLabel : status === 'sending' ? sendingLabel : status === 'done' ? doneLabel : label

  return (
    <div>
      <div
        ref={trackRef}
        className={`relative overflow-hidden rounded-full select-none border ${
          status === 'done' ? 'border-teal-400' : 'border-teal-500/30'
        } ${disabled ? 'opacity-60' : ''}`}
        style={{
          height: HANDLE + PAD * 2,
          background: 'linear-gradient(180deg, rgba(15,23,42,.9), rgba(8,12,28,.95))',
          boxShadow: disabled ? 'none' : '0 0 18px rgba(45,212,191,.14), inset 0 1px 0 rgba(255,255,255,.05)',
        }}
      >
        {/* isian yang melebar mengikuti tombol */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: status === 'idle' ? fillWidth : '100%',
            background: 'linear-gradient(90deg, rgba(45,212,191,.12), rgba(45,212,191,.38))',
          }}
        />

        {/* teks tengah */}
        <motion.span
          aria-hidden="true"
          style={{ opacity: status === 'idle' ? labelOpacity : 1, paddingLeft: HANDLE }}
          className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium text-slate-200 pointer-events-none"
        >
          {text}
          {status === 'idle' && !disabled && <ChevronsRight className="w-4 h-4 text-teal-400 swipe-nudge" aria-hidden="true" />}
        </motion.span>

        <motion.button
          type="button"
          disabled={busy || disabled}
          aria-label={`${ariaLabel}. Geser ke kanan, atau tekan Enter.`}
          drag={busy || disabled ? false : 'x'}
          dragConstraints={{ left: 0, right: maxX }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => { dragged.current = true }}
          onDragEnd={onDragEnd}
          onClick={onClick}
          style={{ x, width: HANDLE, height: HANDLE, top: PAD, left: PAD, touchAction: 'pan-y' }}
          className="absolute z-10 rounded-full flex items-center justify-center text-[#05091A] cursor-grab active:cursor-grabbing disabled:cursor-default"
          whileTap={reduce || busy ? undefined : { scale: 0.95 }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #2DD4BF, #14B8A6)',
              boxShadow: '0 0 16px rgba(45,212,191,.6)',
            }}
          />
          <span className="relative">
            {status === 'sending' ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : status === 'done' ? (
              <Check className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Send className="w-5 h-5" aria-hidden="true" />
            )}
          </span>
        </motion.button>
      </div>

      <p className="sr-only" role="status">
        {status === 'sending' ? sendingLabel : status === 'done' ? doneLabel : ''}
      </p>
    </div>
  )
}
