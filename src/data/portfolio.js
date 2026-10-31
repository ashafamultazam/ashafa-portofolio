// ─── Data Portfolio Ashafa Multazam ──────────────────────────

export const PERSONAL = {
  name: 'Ashafa Multazam',
  title: 'Data Analyst',
  tagline: 'Mengubah data menjadi keputusan bisnis yang bermakna',
  location: 'Bandung, Jawa Barat, Indonesia',
  email: 'multazam.ashafa@gmail.com',
  phone: '+6283130691888',
  linkedin: 'https://linkedin.com/in/ashafamultazam',
  github: 'https://github.com/ashafamultazam',
  bio: `Lulusan program studi sarjana S1 sains data di Universitas Koperasi Indonesia (IKOPIN) 
        dengan IPK 3.36. Memiliki passion di bidang data analysis dan pengalaman mengikuti Data Analytics and Gen AI 
        dari platform RevoU selama 5 bulan. Mampu problem solving yang baik dan bekerja secara 
        mandiri maupun dalam tim, berminat berkontribusi dalam proyek-proyek yang menantang.`,
}

export const STATS = [
  { label: 'IPK', value: 3.36, suffix: '', prefix: '', decimals: 2 },
  { label: 'Sertifikasi', value: 12, suffix: '+', prefix: '' },
  { label: 'Jam Bootcamp', value: 200, suffix: '+', prefix: '' },
  { label: 'Proyek Selesai', value: 8, suffix: '+', prefix: '' },
]

export const SKILLS = [
  {
    category: 'Data & Database',
    icon: '🗄️',
    color: 'teal',
    items: [
      { name: 'SQL / PostgreSQL', level: 85 },
      { name: 'Google BigQuery', level: 80 },
      { name: 'Data Cleansing', level: 82 },
      { name: 'Basic Statistics', level: 78 },
    ]
  },
  {
    category: 'Programming',
    icon: '🐍',
    color: 'amber',
    items: [
      { name: 'Python', level: 80 },
      { name: 'Google Colaboratory', level: 85 },
      { name: 'Pandas / NumPy', level: 75 },
      { name: 'Data Wrangling', level: 78 },
    ]
  },
  {
    category: 'Visualisasi & Tools',
    icon: '📊',
    color: 'teal',
    items: [
      { name: 'Google Looker Studio', level: 80 },
      { name: 'Data Visualization', level: 78 },
      { name: 'Microsoft Excel', level: 85 },
      { name: 'Power BI', level: 80 },
    ]
  },
  {
    category: 'Soft Skills',
    icon: '🧠',
    color: 'amber',
    items: [
      { name: 'Problem Solving', level: 88 },
      { name: 'Team Collaboration', level: 90 },
      { name: 'Communication', level: 82 },
      { name: 'Leadership', level: 80 },
    ]
  },
]

export const EDUCATION = [
  {
    degree: 'S1 Sains Data',
    institution: 'Universitas Koperasi Indonesia (IKOPIN)',
    location: 'Jatinangor',
    period: 'September 2022 – 2026',
    gpa: '3.36',
    status: 'Lulus',
    icon: '🎓',
    description: `Lulusan S1 Sains Data dengan IPK 3,36 yang dibekali fondasi statistika, pemrograman, dan machine learning. 
    Terbiasa mengolah data mentah menjadi insight melalui pembersihan data, analisis, dan visualisasi. 
    Menyelesaikan tugas akhir tentang Segmentasi produk laptop pada E-Commerce Tokopedia menggunakan K-Means Clustering 
    serta proyek analisis data yang dapat dilihat di bagian Projects.`,
  },
  
]

export const CERTIFICATIONS = [
  {
    title: 'Data Analytics and Gen AI',
    issuer: 'RevoU',
    period: 'Agustus 6 – Desember 31, 2024',
    topics: ['Data Analysis', 'Python', 'Data Visualization', 'SQL', 'Basic Statistics', 'Data Cleansing'],
    badge: '🥇',
    color: 'amber',
    highlight: true,
  },
  {
    title: 'AI for Work & Career Readiness with Google AI Products',
    issuer: 'Hacktiv8 Indonesia',
    period: 'Maret 7 – Maret 16, 2026',
    topics: ['AI for Work', 'Career Readiness', 'Google AI Products', 'Final Project'],
    badge: '🤖',
    color: 'teal',
  },
  {
    title: 'TOEFL ITP (450)',
    issuer: 'Pusat Bahasa UNPAD',
    period: 'Juli 2026 – Juli 2026',
    topics: ['TOEFL ITP', 'Grammar', 'Reading', 'Listening', 'Speaking', 'Writing'],
    badge: '🌐',
    color: 'amber',
  },
]

export const ORGANIZATIONS = [
  {
    role: 'Wakil Ketua',
    org: 'Himpunan Mahasiswa Sains Data',
    location: 'Jatinangor',
    period: 'Oktober 2023 – Desember 2024',
    icon: '📚',
    events: [
      `Mengoordinasikan seluruh bidang dan menjaga sinergi antarpengurus 
      dalam pelaksanaan program kerja himpunan selama satu periode kepengurusan.`,
      'Mewakili ketua dalam kegiatan organisasi serta membimbing pengurus internal.',
      `Bertanggung jawab atas 6 program kerja dari 4 bidang yang 
      melibatkan 24 pengurus selama satu periode.`,
    ]
  }
]
export const PROFESSIONAL_EXPERIENCE = [
{
  role: 'Human Capital Intern',
  company: 'Pertamina Patra Niaga RU VI Balongan',
  type: 'Magang',
  period: 'Februari 2026 – Maret 2026',
  location: 'Indramyu',
  icon: '💼',
  points: [
  'Menjadi panitia pelatihan karyawan dengan 300 peserta.', 
  'bertanggung jawab atas administrasi dan dokumentasi kegiatan.',
  `Membangun database sertifikasi dan pelatihan untuk ±300 karyawan di Excel dengan pelacakan masa berlaku sertifikat, 
  sehingga pencarian data dan pemantauan sertifikat yang akan kedaluwarsa jadi lebih cepat.`,
  `Mengaudit dan menstandarkan 1.256 dokumen karyawan dari sistem lama ke struktur folder terstandar dengan checklist kelengkapan, 
  sehingga data siap dimigrasikan ke sistem baru.`,
   ],
  },
]

export const PROJECTS = [
  {
    title: 'Dashboard Kependudukan RT 04 Sawangan Depok',
    description: `Visualisasi demografi kependudukan tingkat RT 
    mencakup distribusi tingkat pendidikan, struktur demografi (usia & gender), 
    komposisi profesi, dan sebaran agama untuk optimalisasi pemetaan serta pelayanan publik lokal.`,
    tech: ['Looker Studio', 'Data Visualization', 'Data Analytics'],
    icon: '👥',
    status: 'Selesai',
    link: 'https://drive.google.com/file/d/14dahu_LZwb-X4_CSLH1pq8QHJZu093mk/view?usp=sharing',
  },
  {
    title: 'HR Analytics Dashboard',
    description: `Dashboard analitik SDM interaktif untuk memetakan metrik attrition karyawan (16.3%), 
    analisis turnover berdasarkan pengalaman kerja, kelompok usia, tingkat gaji (Salary Slab), 
    serta kepuasan tiap peran jabatan (Job Role & Satisfaction).`,
    tech: ['Looker Studio', 'HR Analytics', 'Business Intelligence'],
    icon: '📊',
    status: 'Selesai',
    link: 'https://drive.google.com/file/d/1E2wHb309ozUogUOTJPTbBU0I6-KxNG2A/view?usp=sharing',
  },
  {
    title: 'Dashboard Global Superstore (MSIB RevoU)',
    description: `Analisis performa bisnis ritel global yang mengidentifikasi kendala profitabilitas kategori Furniture, 
    evaluasi pola kerugian (minus profit) pada sub-kategori Tables & Bookcases, 
    efisiensi biaya pengiriman per wilayah, serta rasio metode pengiriman.`,
    tech: ['Looker Studio', 'Business Analytics', 'Data Visualization', 'SQL'],
    icon: '🛒',
    status: 'Selesai',
    link: 'https://drive.google.com/file/d/12fcCnOOTtub4S2YPppceG4buzm9zZJpY/view?usp=sharing',
  },
  {
    title: 'Dashboard Proyek Business Intelligence',
    description: `Pengembangan dashboard Business Intelligence multi-dimensi yang mengintegrasikan metrik kinerja operasional, 
    analisis segmentasi pelanggan (Customer Value & Segment), serta pemantauan biaya logistik untuk mendukung pengambilan keputusan strategis.`,
    tech: ['Looker Studio', 'BigQuery', 'SQL', 'Data Analytics'],
    icon: '⚙️',
    status: 'Selesai',
    link: 'https://drive.google.com/file/d/1E2wHb309ozUogUOTJPTbBU0I6-KxNG2A/view?usp=sharing',
  },
]
