# task.md — Expense & Budget Visualizer

## Overview
Pengembangan aplikasi *Expense & Budget Visualizer* dengan pendekatan *mobile-first*, terbagi bersih antara struktur HTML, styling CSS, dan logika JS (LocalStorage + Chart.js).

---

## Task Checklist

- [ ] **1. Setup Project Structure & HTML Layout (`index.html`)**
  - [x] **1.1 Base Markup Setup**
    - [x] Buat struktur HTML5 semantik (`header`, `main`, `footer`)
    - [x] Tambahkan meta viewport mobile-first (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
    - [x] Import Chart.js via CDN (v3.9.1)
  - [ ] **1.2 UI Component Containers**
    - [x] Section **Balance Display** (Menampilkan total pengeluaran)
    - [x] Form **Transaction Input** (Amount, Category dropdown, Date, Submit button)
    - [ ] Section **Category Management** (Input & collapsible container untuk tambah kategori baru)
    - [ ] **Filter Tabs** (*Today* / *This Month*)
    - [ ] Container **Doughnut Chart** & tempat **Transaction History List**

- [ ] **2. CSS & Mobile-First Styling (`css/style.css`)**
  - [ ] **2.1 Base & Layout Styles**
    - [ ] Atur CSS reset (`box-sizing: border-box`, reset margin/padding) & tipografi dasar
    - [ ] Terapkan layout berbasis kartu (*card-based layout*) dengan flexbox/grid vertikal
  - [ ] **2.2 Mobile Touch & Responsiveness**
    - [ ] Atur touch target minimal **44x44px** untuk semua tombol, input, dan select
    - [ ] Buat tombol & input berukuran *full-width* di tampilan layar kecil
    - [ ] Tambahkan media query `@media (min-width: 768px)` untuk breakpoint tablet/desktop
  - [ ] **2.3 Error & Empty State Styles**
    - [ ] Styling *error message* inline (teks merah, latar merah muda, rounded border)
    - [ ] Styling tampilan *empty state* saat riwayat transaksi/chart masih kosong

- [ ] **3. Data Layer & LocalStorage Adapter (`js/app.js`)**
  - [ ] **3.1 Data Models & Initial State**
    - [ ] Deklarasikan struktur data `Transaction` `{id, amount, categoryId, category, date}`
    - [ ] Deklarasikan struktur data `Category` `{id, name}`
    - [ ] Atur kategori bawaan wajib: `"General"`
  - [ ] **3.2 Storage Adapter**
    - [ ] Implementasikan `loadStorage()` dengan fallback data kosong
    - [ ] Implementasikan `saveStorage()` yang dibungkus `try-catch` untuk menangani error LocalStorage

- [ ] **4. Core Business Logic (`js/app.js`)**
  - [ ] **4.1 CategoryManager**
    - [ ] Metode mengambil daftar kategori terurut
    - [ ] Metode penambahan kategori baru dengan validasi (cegah nama kosong/duplikat)
  - [ ] **4.2 TransactionManager**
    - [ ] Metode penambahan transaksi dengan validasi (`amount > 0`)
    - [ ] Metode penghapusan transaksi berdasarkan `id`
    - [ ] Fungsi filter transaksi harian (*Today*) & bulanan (*This Month*)
    - [ ] Pengurutan otomatis transaksi berdasarkan tanggal terbaru (*descending*)
  - [ ] **4.3 BalanceCalculator & ChartAggregator**
    - [ ] Kalkulasi total saldo dengan format 2 desimal
    - [ ] Agregasi pengeluaran per kategori & kalkulasi persentase untuk Chart.js

- [ ] **5. UI Components & Event Handling (`js/app.js`)**
  - [ ] **5.1 Chart.js Integration**
    - [ ] Inisialisasi Doughnut Chart via Chart.js
    - [ ] Buat fungsi `updateChart()` untuk pemutakhiran data grafik secara dinamis
  - [ ] **5.2 UI Handlers & State Syncing**
    - [ ] Event handler `submit` form transaksi & kategori baru
    - [ ] Event handler hapus transaksi pada daftar riwayat
    - [ ] Event handler toggle tab periode (*Today* vs *This Month*)
    - [ ] Sinkronkan seluruh UI (Balance, Chart, History, LocalStorage) setiap ada perubahan data

- [ ] **6. Manual Verification & Edge Case Testing**
  - [ ] **6.1 Validation Check**
    - [ ] Uji input valid & penolakan input invalid (angka <= 0, string kosong)
    - [ ] Uji alur pergantian tab periode & pemutakhiran chart
    - [ ] Uji ketahanan data (*refresh* halaman untuk memastikan data tersimpan di LocalStorage)