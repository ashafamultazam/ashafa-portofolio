import { useState } from 'react'
import { FileText } from 'lucide-react'

/**
 * Thumbnail pratinjau sertifikat.
 * src       : alamat gambar (sudah lengkap). null = tampilkan emoji sebagai pengganti
 * clickable : true = tampilkan lencana & tombol "lihat" saat di-hover
 * label     : teks pada lencana kiri atas
 * cta       : teks pada tombol saat di-hover
 * ratio     : kelas aspect ratio Tailwind, mis. 'aspect-[16/10]'
 */
export default function PdfThumb({ src, title, clickable, emoji, ratio = 'aspect-[16/10]', label = 'SERTIFIKAT', cta = 'Lihat sertifikat' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative ${ratio} overflow-hidden bg-navy-800 border-b border-slate-700/30`}>
      {src && !failed ? (
        <img
          src={src}
          alt={`Pratinjau ${title}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-teal-500/10 to-amber-500/5" aria-hidden="true">
          {emoji}
        </div>
      )}

      {clickable && (
        <>
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded glass font-mono text-[10px] text-teal-400">
            {label}
          </span>
          <div className="absolute inset-0 flex items-end justify-end p-3 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md glass text-xs font-medium text-teal-300">
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              {cta}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
