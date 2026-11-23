import { createClient } from '@supabase/supabase-js'

// ============================================================
// KONFIGURASI SUPABASE
// Ganti dengan URL dan ANON KEY dari project Supabase Anda
// Buat project di: https://supabase.com
// ============================================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Comments Service ──────────────────────────────────────────
// Hanya kolom yang aman ditampilkan yang pernah diminta (email TIDAK diambil/disimpan lagi).
const COMMENT_COLUMNS = 'id,name,message,created_at'

export const commentsService = {
  // Ambil komentar yang SUDAH disetujui (approved = true)
  async getAll() {
    const { data, error } = await supabase
      .from('comments')
      .select(COMMENT_COLUMNS)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    return data
  },

  // Kirim komentar baru. Hanya name & message yang dikirim; kolom approved/created_at
  // ditentukan server (lihat supabase-keamanan.sql), jadi pengunjung tidak bisa menyetujui
  // komentarnya sendiri atau memalsukan tanggal. Tanpa .select() karena komentar baru
  // belum boleh dibaca publik sebelum disetujui.
  async create({ name, message }) {
    const { error } = await supabase.from('comments').insert([{ name, message }])
    if (error) throw error
  },
}

// ─── Portfolio Views Service ────────────────────────────────────
export const viewsService = {
  async increment() {
    const { error } = await supabase.rpc('increment_views')
    if (error) console.warn('Views tracking:', error.message)
  },

  async getCount() {
    const { data, error } = await supabase
      .from('portfolio_views')
      .select('count')
      .single()
    if (error) return 0
    return data?.count || 0
  }
}

// ─── SQL ────────────────────────────────────────────────────────
// Skrip pengamanan lengkap ada di file: supabase-keamanan.sql (jalankan di Supabase > SQL Editor).
