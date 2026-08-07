# 💰 Expense & Budget Visualizer

> **CodingCamp-3August26-Muhammad_Abdurrahman_As-Syauqi**

Aplikasi web mobile-friendly untuk melacak pengeluaran harian dengan visualisasi data yang menarik. Dibangun dengan Vanilla JavaScript, Chart.js, dan desain modern yang responsif.

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4.4.3-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

---

## 📖 Deskripsi

**Expense & Budget Visualizer** adalah aplikasi manajemen keuangan pribadi yang membantu Anda mencatat, mengorganisir, dan memvisualisasikan pengeluaran harian. Dengan antarmuka yang intuitif dan fitur-fitur lengkap, aplikasi ini memudahkan Anda untuk tetap berada di jalur anggaran.

---

## ✨ Fitur Utama

### 💳 Manajemen Transaksi
- ➕ **Tambah Transaksi**: Input nama item, jumlah, tanggal, dan kategori
- 👁️ **Lihat Riwayat**: Daftar lengkap semua transaksi dengan detail
- 🗑️ **Hapus Transaksi**: Hapus transaksi individual atau semua sekaligus

### 🏷️ Manajemen Kategori
- 📦 **Kategori Bawaan**: Makanan, Transportasi, Hiburan (dengan ikon Lucide)
- ➕ **Kategori Kustom**: Buat kategori baru sesuai kebutuhan Anda
- 🎨 **Ikon Otomatis**: Setiap kategori dilengkapi dengan ikon yang menarik

### 📊 Analitik Visual
- 🍩 **Grafik Doughnut**: Visualisasi distribusi pengeluaran per kategori menggunakan Chart.js
- 📈 **Persentase Real-time**: Lihat proporsi pengeluaran setiap kategori
- 🎨 **Palet Warna Teal**: Skema warna yang konsisten dan modern

### 📅 Ringkasan Bulanan
- 🗓️ **Agregasi Bulanan**: Total pengeluaran dan jumlah transaksi per bulan
- 📊 **Tampilan Terurut**: Bulan terbaru ditampilkan di atas
- 💡 **Statistik Cepat**: Lihat tren pengeluaran Anda dari waktu ke waktu

### 🔀 Pengurutan & Filter
- 🆕 **Terbaru**: Transaksi terbaru di atas
- 🕰️ **Terlama**: Transaksi terlama di atas
- 💰 **Tertinggi/Terendah**: Urutkan berdasarkan jumlah pengeluaran
- 🏷️ **Kategori**: Kelompokkan berdasarkan kategori

### 🚨 Peringatan Pengeluaran
- ⚠️ **Threshold Alert**: Set batas pengeluaran untuk highlight transaksi tinggi
- 🎯 **Visual Highlight**: Transaksi di atas threshold ditandai dengan warna warning
- 💾 **Persistensi**: Pengaturan threshold disimpan otomatis

### 🌓 Mode Tema
- 🌙 **Dark Mode**: Tema gelap yang nyaman untuk mata di malam hari
- ☀️ **Light Mode**: Tema terang yang fresh dan clean
- 💾 **Auto-Save**: Preferensi tema tersimpan di localStorage

### 💾 Penyimpanan Data
- 🔄 **LocalStorage**: Data tersimpan di browser, tidak hilang saat refresh
- 📦 **Semua Data Tersimpan**: Transaksi, kategori kustom, tema, sort, dan threshold
- 🔒 **Privacy**: Data hanya tersimpan di perangkat Anda

### 📱 Desain Responsif
- 📱 **Mobile-First**: Dioptimalkan untuk perangkat sentuh
- 💻 **Desktop-Friendly**: Tampilan grid 2-kolom untuk layar besar
- 🎯 **Touch-Optimized**: Tombol dan kontrol yang mudah diakses

### 🎨 UI/UX Modern
- 🎨 **Skema Warna Teal**: Palet warna yang konsisten dan profesional
- 🔤 **Font Poppins**: Tipografi yang clean dan modern dari Google Fonts
- 🎭 **Lucide Icons**: Ikon-ikon SVG yang tajam dan indah
- ⭕ **Rounded Corners**: Sudut melengkung yang memberikan kesan modern
- ✨ **Smooth Animations**: Transisi dan animasi yang halus

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **HTML5** | - | Struktur markup semantik |
| **CSS3** | - | Styling dengan CSS Variables untuk theming |
| **JavaScript (ES6+)** | - | Logika aplikasi dengan Vanilla JS |
| **Chart.js** | v4.4.3 | Library visualisasi data untuk grafik doughnut |
| **Lucide Icons** | Latest | Library ikon SVG modern |
| **Google Fonts** | - | Font Poppins (300-800 weights) |
| **LocalStorage API** | - | Penyimpanan data lokal di browser |

---

## 🚀 Instalasi & Penggunaan

### Persyaratan
- Browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet (untuk memuat CDN pada first load)

### Langkah Instalasi

1. **Clone atau Download Repository**
   ```bash
   git clone [URL_REPOSITORY]
   cd REVOU-SE
   ```

2. **Buka Aplikasi**
   
   Cara termudah: Buka file `index.html` langsung di browser Anda
   
   Atau gunakan live server (contoh dengan VS Code Live Server):
   ```bash
   # Install Live Server extension di VS Code
   # Klik kanan pada index.html > Open with Live Server
   ```

3. **Mulai Menggunakan**
   
   Tidak ada instalasi dependencies atau build process yang diperlukan! 🎉

---

## 📚 Cara Menggunakan

### 1️⃣ Menambah Transaksi
1. Isi **Nama Item** (contoh: "Makan siang")
2. Masukkan **Jumlah** dalam Rupiah (contoh: 25000)
3. Pilih **Tanggal** transaksi
4. Pilih **Kategori** dari dropdown
5. Klik tombol **"Tambah Transaksi"**

### 2️⃣ Membuat Kategori Kustom
1. Scroll ke bagian **"Kategori Kustom"**
2. Ketik nama kategori baru (contoh: "Kesehatan")
3. Klik tombol **"Tambah"**
4. Kategori baru akan muncul dengan ikon otomatis
5. Kategori langsung tersedia di dropdown form

### 3️⃣ Menghapus Transaksi
- **Individual**: Klik ikon 🗑️ di sebelah kanan transaksi
- **Semua**: Klik tombol **"Hapus Semua"** di atas daftar transaksi

### 4️⃣ Mengatur Urutan Transaksi
Pilih dari dropdown **"Urutkan"**:
- **Terbaru**: Transaksi terbaru muncul di atas
- **Terlama**: Transaksi terlama muncul di atas
- **Tertinggi**: Pengeluaran terbesar di atas
- **Terendah**: Pengeluaran terkecil di atas
- **Kategori**: Diurutkan berdasarkan nama kategori

### 5️⃣ Mengatur Alert Pengeluaran
1. Masukkan nominal di field **"Alert (Rp)"**
2. Transaksi di atas nominal tersebut akan di-highlight dengan warna kuning
3. Berguna untuk memantau pengeluaran besar

### 6️⃣ Toggle Dark/Light Mode
- Klik ikon 🌙/☀️ di pojok kanan atas header
- Tema akan berubah dan tersimpan otomatis

---

## 📁 Struktur Proyek

```
REVOU-SE/
│
├── index.html              # File HTML utama
├── README.md               # Dokumentasi proyek (file ini)
│
├── css/
│   └── style.css           # Stylesheet utama dengan CSS Variables
│
└── js/
    └── app.js              # Logika aplikasi (Vanilla JavaScript)
```

### Detail File

#### `index.html`
- Struktur markup semantik dengan ARIA labels
- CDN untuk Chart.js v4.4.3 dan Lucide Icons
- Google Fonts (Poppins)
- Layout responsif dengan grid system

#### `css/style.css`
- CSS Custom Properties (Variables) untuk theming
- Dark mode support dengan `[data-theme="dark"]`
- Mobile-first responsive design
- Smooth animations dan transitions
- Custom scrollbar styling

#### `js/app.js`
- State management dengan object `state`
- CRUD operations untuk transaksi
- LocalStorage persistence
- Chart.js integration
- Form validation
- Event delegation pattern
- Modular function structure

---

## 📸 Screenshots

### 💡 Light Mode
> _Tangkapan layar mode terang akan ditampilkan di sini_

### 🌙 Dark Mode
> _Tangkapan layar mode gelap akan ditampilkan di sini_

### 📱 Mobile View
> _Tangkapan layar tampilan mobile akan ditampilkan di sini_

---

## 🌐 Kompatibilitas Browser

| Browser | Versi Minimum | Status |
|---------|---------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

**Catatan**: Aplikasi menggunakan ES6+ features (arrow functions, destructuring, template literals, dll). Pastikan browser Anda up-to-date untuk pengalaman terbaik.

---

## 🔮 Pengembangan Masa Depan

Fitur-fitur yang direncanakan untuk versi mendatang:

- [ ] 📥 **Export/Import Data**: Ekspor data ke CSV/JSON
- [ ] 🎯 **Budget Goals**: Set target pengeluaran bulanan dengan progress bar
- [ ] 📊 **Grafik Tambahan**: Line chart untuk tren pengeluaran, bar chart komparatif
- [ ] 🔔 **Notifikasi**: Push notifications untuk reminder
- [ ] 🌍 **Multi-Currency**: Support berbagai mata uang
- [ ] 👥 **Multi-User**: Login dan sync data antar device
- [ ] 📱 **PWA**: Progressive Web App untuk install ke home screen
- [ ] 🔍 **Search & Filter**: Cari transaksi berdasarkan nama, kategori, atau rentang tanggal
- [ ] 📝 **Notes**: Tambahkan catatan pada setiap transaksi
- [ ] 🏦 **Pendapatan**: Track income selain expense untuk net balance
- [ ] 📷 **Receipt Scanner**: Upload dan simpan foto struk
- [ ] 🤖 **AI Insights**: Analisis pola pengeluaran dengan AI

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Clone** fork Anda ke lokal
   ```bash
   git clone https://github.com/username-anda/revou-se.git
   ```
3. **Buat branch** untuk fitur baru
   ```bash
   git checkout -b fitur-baru
   ```
4. **Commit** perubahan Anda
   ```bash
   git commit -m "Menambahkan fitur XYZ"
   ```
5. **Push** ke branch Anda
   ```bash
   git push origin fitur-baru
   ```
6. **Buat Pull Request** dengan deskripsi yang jelas

### Guidelines Kontribusi
- Pastikan kode mengikuti style yang ada
- Test secara menyeluruh di berbagai browser
- Update dokumentasi jika diperlukan
- Hindari breaking changes tanpa diskusi terlebih dahulu

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan **edukasi** dan **portofolio**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini dengan tetap memberikan kredit kepada penulis asli.

**MIT License** - Lihat file `LICENSE` untuk detail lengkap (jika ada).

---

## 👨‍💻 Author

**Muhammad Abdurrahman As-Syauqi**

- 📧 Email: [email-anda@example.com]
- 🌐 Portfolio: [portfolio-anda.com]
- 💼 LinkedIn: [linkedin.com/in/username-anda]
- 🐙 GitHub: [github.com/username-anda]
- 📱 Instagram: [@username-anda]

> 📅 **Tanggal Pembuatan**: 3 Agustus 2026  
> 🎓 **Program**: RevoU Coding Camp

---

## 🙏 Acknowledgments

Terima kasih kepada:

- **[Chart.js](https://www.chartjs.org/)** - Library visualisasi data yang powerful dan fleksibel
- **[Lucide Icons](https://lucide.dev/)** - Beautiful & consistent icon set
- **[Google Fonts](https://fonts.google.com/)** - Poppins font family
- **[RevoU](https://revou.co/)** - Platform pembelajaran yang luar biasa
- **MDN Web Docs** - Dokumentasi referensi yang sangat membantu
- **Stack Overflow Community** - Untuk solusi berbagai tantangan coding

---

## 📝 Catatan Penting

### Accessibility
Aplikasi ini dirancang dengan mempertimbangkan aksesibilitas:
- ✅ Semantic HTML structure
- ✅ ARIA labels untuk screen readers
- ✅ Keyboard navigation support
- ✅ High contrast colors di light mode
- ✅ Focus indicators yang jelas

**Catatan**: Untuk validasi aksesibilitas penuh (WCAG 2.1 compliance), diperlukan testing manual dengan assistive technologies dan expert accessibility review.

### Data Privacy
- 🔒 Semua data disimpan secara **lokal** di browser Anda (localStorage)
- 🚫 **Tidak ada** data yang dikirim ke server
- 🌐 **Tidak ada tracking** atau analytics
- 💾 Data hanya ada di perangkat Anda dan dapat dihapus kapan saja dengan clear browser data

### Tips Penggunaan
- 💡 Gunakan kategori yang konsisten untuk analisis yang lebih baik
- 📊 Lihat grafik untuk memahami pola pengeluaran Anda
- ⚠️ Set threshold alert pada nilai yang relevan dengan budget Anda
- 🔄 Backup data secara berkala (future feature: export/import)

---

## 📞 Support & Feedback

Jika Anda menemukan bug, memiliki pertanyaan, atau ingin memberikan feedback:

1. 🐛 **Bug Reports**: Buat issue di GitHub repository
2. 💡 **Feature Requests**: Diskusikan di GitHub Discussions
3. 📧 **Contact**: Kirim email ke [email-anda@example.com]
4. ⭐ **Star**: Jika Anda menyukai proyek ini, beri ⭐ di GitHub!

---

<div align="center">

**Made with ❤️ and ☕ by Muhammad Abdurrahman As-Syauqi**

⭐ **Star this repo if you find it helpful!** ⭐

---

*Happy Tracking Your Expenses! 💰📊*

</div>
