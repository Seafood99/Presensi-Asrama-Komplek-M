# Proyek Presensi Santri - Komplek M Al-Busyro
Ini adalah proyek presensi santri yang dibangun menggunakan React, Vite, dan Tailwind CSS. Proyek ini bertujuan untuk mengefisiensikan pengelolaan data presensi santri di asrama Komplek M Al-Busyro, dengan fitur yang memudahkan admin dan santri untuk melihat dan mengelola data presensi.

# Fitur Utama
  - Login Admin dan Santri: Admin memiliki akses penuh untuk mengelola data presensi, sementara santri hanya dapat melihat status kehadiran mereka.
  - Presensi Ngaji: Tabel presensi harian untuk dua sesi: Ba'da Subuh dan Ba'da Maghrib.
  - Halaman Santri: Menampilkan data santri secara lengkap, dengan jumlah total santri, santri aktif, dan santri nonaktif.
  - Animasi Hitung Otomatis: Pada halaman santri, data jumlah santri ditampilkan dengan animasi yang menarik.
  - 
# Persyaratan Sistem
Sebelum memulai, pastikan bahwa sistem kamu sudah memiliki:
  - Node.js (versi 14 atau lebih baru)
  - npm atau yarn (sebagai package manager)
Instalasi
Ikuti langkah-langkah di bawah ini untuk meng-clone dan menjalankan proyek ini secara lokal:

Clone repository ini:

bash
Copy code
git clone https://github.com/username/reponame.git
cd reponame
Instal dependensi: Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:

bash
Copy code
npm install
atau jika menggunakan yarn:

bash
Copy code
yarn install
Jalankan server lokal: Untuk menjalankan aplikasi di lingkungan pengembangan, gunakan perintah berikut:

bash
Copy code
npm run dev
atau dengan yarn:

bash
Copy code
yarn dev
Aplikasi akan berjalan di http://localhost:5173/.

Menjalankan API Backend: Pastikan kamu juga menjalankan server backend (Express.js). Kamu bisa menjalankan server dengan perintah:

bash
Copy code
node server.js
API akan tersedia di http://localhost:4100/.

Struktur Direktori
Berikut adalah gambaran singkat mengenai struktur direktori proyek ini:

bash
Copy code
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
Konfigurasi Tambahan
Tailwind CSS
Proyek ini menggunakan Tailwind CSS untuk styling. Jika kamu ingin menyesuaikan tema atau konfigurasi lainnya, file konfigurasi Tailwind bisa ditemukan di:

arduino
Copy code
tailwind.config.js
AOS (Animate On Scroll)
AOS digunakan untuk animasi pada halaman santri. Jika ingin menyesuaikan atau menambahkan lebih banyak efek animasi, konfigurasi bisa ditambahkan di dalam komponen-komponen yang diinginkan.

Kontribusi
Jika kamu ingin berkontribusi pada proyek ini, silakan fork repository ini dan ajukan pull request dengan perubahan yang ingin kamu tambahkan.

Fork repo ini.
Buat branch untuk fitur atau perbaikan baru: git checkout -b fitur-anda.
Commit perubahanmu: git commit -m 'Menambahkan fitur X'.
Push ke branch: git push origin fitur-anda.
Ajukan pull request ke repository ini.
