# Proyek Presensi Santri - Komplek M Al-Busyro

Ini adalah proyek presensi santri yang dibangun menggunakan **React**, **Vite**, dan **Tailwind CSS**. Proyek ini bertujuan untuk meningkatkan efisiensi pengelolaan presensi santri di asrama Komplek M Al-Busyro, dengan fitur yang memudahkan admin dan santri dalam melihat dan mengelola data presensi.

## Fitur Utama
- **Login Admin dan Santri**: Admin memiliki akses penuh untuk mengelola data presensi, sementara santri hanya dapat melihat status kehadiran mereka.
- **Presensi Ngaji**: Tabel presensi harian untuk dua sesi: Ba'da Subuh dan Ba'da Maghrib.
- **Halaman Santri**: Menampilkan data santri secara lengkap, termasuk jumlah total santri, santri aktif, dan santri nonaktif.
- **Animasi Hitung Otomatis**: Pada halaman santri, data jumlah santri ditampilkan dengan animasi yang menarik menggunakan CountUp.

## Persyaratan Sistem
Pastikan bahwa sistem kamu sudah memiliki:
- **Node.js** (versi 14 atau lebih baru)
- **npm** atau **yarn** (sebagai package manager)

## Instalasi
Ikuti langkah-langkah di bawah ini untuk meng-clone dan menjalankan proyek ini secara lokal:

### 1. Clone repository ini:
```bash
git clone (https://github.com/Seafood99/Presensi-Asrama-Komplek-M.git)
cd reponame
```
### 2. Install depensi:
```bash
npm install
```

### 3. Jalankan server lokal:
```bash
npm run dev
```
Aplikasi akan berjalan di http://localhost:5173.

### 4. Menjalankan API Backend Sederhana
Pastikan kamu juga menjalankan server backend (Express.js). Kamu bisa menjalankan server dengan perintah berikut:
```bash
node server.js
```
API akan tersedia di http://localhost:4100.

### Dependensi Utama yang Digunakan
- **React:** Library JavaScript untuk membangun UI.
- **Vite:** Build tool yang sangat cepat untuk proyek berbasis web.
- **Tailwind CSS:**: Framework utility-first CSS untuk styling.
- **SweetAlert2:** Library untuk membuat alert yang interaktif.
- **CountUp.js:** Library untuk animasi angka.
- **AOS (Animate on Scroll):** Library untuk animasi elemen saat halaman di-scroll.

### Struktur Direktori
Berikut adalah gambaran singkat mengenai struktur direktori proyek ini:
```bash
src/
│
├── components/
│   ├── Clock.jsx            # Komponen jam realtime
│   ├── LogoutButton.jsx      # Komponen tombol logout
│   ├── PresensiTable.jsx     # Komponen tabel presensi
│   └── MdiUser.jsx           # Ikon user
│
├── pages/
│   ├── Dashboard.jsx         # Halaman dashboard
│   ├── Login.jsx             # Halaman login
│   ├── PresensiPage.jsx      # Halaman presensi santri
│   └── SantriPage.jsx        # Halaman data santri
│
├── App.jsx                   # Konfigurasi utama routing aplikasi
├── main.jsx                  # Entry point aplikasi
└── assets/                   # File aset (ikon, gambar, dll.)
```

### Konfigurasi Tambahan
# Tailwind CSS
Proyek ini menggunakan Tailwind CSS untuk styling. Jika kamu ingin menyesuaikan tema atau konfigurasi lainnya, file konfigurasi Tailwind bisa ditemukan di:
```bash
tailwind.config.js
```

### AOS (Animate On Scroll)
Proyek ini menggunakan AOS untuk animasi pada halaman santri. Jika ingin menyesuaikan atau menambahkan lebih banyak efek animasi, konfigurasi bisa ditambahkan di dalam komponen-komponen yang diinginkan.

### Kontribusi
Jika kamu ingin berkontribusi pada proyek ini, silakan fork repository ini dan ajukan pull request dengan perubahan yang ingin kamu tambahkan.

Langkah-langkah untuk berkontribusi:

- Fork repository ini.
- Buat branch untuk fitur atau perbaikan baru:
  ```bash
  git checkout -b fitur-anda
  ```
- commit perubahanmu
  ```bash
  git commit -m 'Menambahkan fitur X'
  ```
- push ke branch
  ```bash
  git push origin fitur-anda
  ```
- ajukan pull request repo ini




