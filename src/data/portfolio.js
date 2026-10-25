// ─── Data Portfolio Ashafa Multazam ──────────────────────────

export const PERSONAL = {
  name: 'Ashafa Multazam',
  title: 'Data Analyst',
  tagline: 'Mengubah data menjadi keputusan bisnis yang bermakna',
  location: 'Bandung, Jawa Barat, Indonesia',
  email: 'multazam@gmail.com',
  phone: '+6283130691888',
  linkedin: 'https://linkedin.com/in/ashafamultazam',
  github: 'https://github.com/ashafamultazam',
  bio: `Lulusan program studi sarjana S1 sains data di Universitas Koperasi Indonesia (IKOPIN) dengan IPK 3.36. Memiliki passion 
        di bidang data analysis dan pengalaman mengikuti FullStack Intensive Bootcamp Data Analysis 
        dari platform MySkill selama 2 bulan. Mampu problem solving yang baik dan bekerja secara 
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
    description: 'Mahasiswa aktif semester 5, fokus pada data science, machine learning, dan analisis data.',
  },
  
]

export const CERTIFICATIONS = [
  {
    title: 'Mini Bootcamp DQLab Batch#10',
    issuer: 'DQLab',
    period: '16-21 Februari 2026',
    topics: ['Machine Learning & AI', 'Data Analyst with SQL & Python', 'Python for Data Science', 'Fundamental SQL'],
    badge: '🏅',
    color: 'teal',
  },
  {
    title: 'Data Analyst FullStack Intensive Bootcamp Batch#14',
    issuer: 'MySkill',
    period: 'Januari 5 – Februari 16, 2024',
    topics: ['Data Analysis', 'Basic Statistics', 'Data Cleansing', 'SQL', 'Python', 'Data Visualization'],
    badge: '🥇',
    color: 'amber',
    highlight: true,
  },
  {
    title: 'Final Project Mentoring',
    issuer: 'MySkill',
    period: 'Februari 3 – 19, 2024',
    topics: ['SQL', 'Python', 'Data Visualization'],
    badge: '📜',
    color: 'teal',
  },
  {
    title: 'TOEFL Preparation Bootcamp',
    issuer: 'MySkill',
    period: 'Juni 7 – Juli 5, 2024',
    topics: ['TOEFL iBT', 'Grammar', 'Reading', 'Listening', 'Speaking', 'Writing'],
    badge: '🌐',
    color: 'amber',
  },
]

export const ORGANIZATIONS = [
  {
    role: 'Anggota',
    org: 'Pustaka Insani Institute (PII)',
    location: 'Kabupaten Halmahera Timur',
    period: '2025 – 2026',
    icon: '📚',
  },
  {
    role: 'Wasekum Teknologi & Kreatif Digital',
    org: 'HMI Komisariat Cakrawala UICI',
    location: 'Jakarta',
    period: '2025 – 2026',
    icon: '💡',
  },
  {
    role: 'Anggota Bidang Pendidikan & Pengkaderan',
    org: 'Ikatan Pelajar Mahasiswa Halmahera Timur (IPM-HT) Bogor',
    location: 'Bogor',
    period: '2022 – 2026',
    icon: '🎓',
    events: [
      'Ketua Panitia MUSYAWARAH BESAR (MUBES) - Juli 2022 & Agustus 2024',
      'Ketua Panitia Pelantikan & Diskusi Publik - November 2022',
      'Sekretaris Panitia SPO - Februari 2023',
      'Ketua Panitia SPO - Februari 2022',
      'Koordinator Seksi HUMAS - November 2024',
    ]
  },
  {
    role: 'Delegasi - Devisi Lingkungan Hidup',
    org: 'Garuda Nusa Youth Action GNYA#3',
    location: 'Desa Tenganan, Bali',
    period: 'Januari 2022',
    icon: '🌿',
    events: [
      'Recycle Hanging Plant – mendaur ulang botol bekas',
      'Street Sign/Information – edukasi lingkungan',
      'Hydroponic NFT & Metode WICK',
      'EcoEnzyme – alternatif pembersih ramah lingkungan',
    ]
  },
  {
    role: 'Koordinator WCD & Pendiri Komunitas SODARA',
    org: 'World Cleanup Day – Kabupaten Halmahera Timur',
    location: 'Halmahera Timur',
    period: 'September – Oktober 2021',
    icon: '♻️',
    events: [
      'Koordinator sosialisasi lingkungan SD, SMP, SMA, dan instansi terkait',
      'Pendiri Komunitas Solidaritas Sadar Sampah (SODARA) Halmahera – 11 Oktober 2020',
    ]
  },
]

export const PROJECTS = [
  {
    title: 'Analisis Penjualan E-Commerce',
    description: 'Analisis komprehensif data transaksi e-commerce menggunakan SQL dan Python untuk mengidentifikasi tren penjualan dan perilaku pelanggan.',
    tech: ['Python', 'SQL', 'Pandas', 'Looker Studio'],
    icon: '🛒',
    status: 'Selesai',
  },
  {
    title: 'Dashboard KPI Regional',
    description: 'Dashboard interaktif menggunakan Google Looker Studio untuk memvisualisasikan KPI bisnis multi-regional dengan update data real-time.',
    tech: ['BigQuery', 'Looker Studio', 'SQL'],
    icon: '📊',
    status: 'Selesai',
  },
  {
    title: 'Prediksi Churn Customer',
    description: 'Model machine learning untuk memprediksi kemungkinan churn pelanggan dengan analisis feature importance dan rekomendasi retensi.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    icon: '🤖',
    status: 'Selesai',
  },
  {
    title: 'Data Pipeline Automation',
    description: 'Otomasi pipeline pengolahan data dari berbagai sumber menggunakan Python script untuk menghasilkan laporan harian yang konsisten.',
    tech: ['Python', 'SQL', 'Google Sheets API'],
    icon: '⚙️',
    status: 'Selesai',
  },
]
