import { useState } from 'react'
import { FileText } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

// Ambil ID file dari link Google Drive (…/d/FILE_ID/view atau …?id=FILE_ID)
const driveId = (url = '') =>
  url.match(/\/d\/([\w-]+)/)?.[1] || url.match(/[?&]id=([\w-]+)/)?.[1] || null

// 1) gambar sendiri di /public/previews (paling andal), isi field `preview`
// 2) kalau tidak ada, pakai thumbnail otomatis halaman pertama PDF dari Google Drive
function previewSrc({ preview, link }) {
  if (preview) return `${BASE}previews/${preview}`
  const id = driveId(link)
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : null
}

/**
 * Thumbnail pratinjau PDF.
 * item   : objek dengan { link, preview, title, badge/icon }
 * ratio  : kelas aspect ratio Tailwind, mis. 'aspect-[2/1]'
 * label  : teks pada lencana kiri atas ("PDF", "SERTIFIKAT", dll.)
 * cta    : teks pada tombol saat di-hover
 */
export default function PdfThumb({ item, ratio = 'aspect-[16/10]', label = 'PDF', cta = 'Buka PDF', emoji }) {
  const [failed, setFailed] = useState(false)
  const src = previewSrc(item)

  return (
    <div className={`relative ${ratio} overflow-hidden bg-navy-800 border-b border-slate-700/30`}>
      {src && !failed ? (
        <img
          src={src}
          alt={`Pratinjau ${item.title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-teal-500/10 to-amber-500/5" aria-hidden="true">
          {emoji}
        </div>
      )}

      {item.link && (
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
