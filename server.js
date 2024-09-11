import express from 'express';
const app = express();
const port = 4100;

// Middleware untuk parsing JSON
app.use(express.json()); // Menggantikan body-parser

// Fungsi untuk menerjemahkan kode jenjang studi
const getJenjangStudi = (kode) => {
    const jenjang = {
        "01": "SD",
        "02": "SMP",
        "03": "SMA",
        "04": "Kuliah"
    };
    return jenjang[kode] || "Jenjang tidak diketahui";
};

// Data dummy santri dengan NIS sebagai ID login dan password default
const santri = [
    { nama: "Muhammad Dawam Amali", nis: "2204010", tanggal_lahir: "2000-05-15", jenjang_studi: "04", tahun_masuk: "2022", password: "admin123" },
    { nama: "Ahmad Ridho Prasetyo", nis: "2203009", tanggal_lahir: "1999-12-04", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Mulyono Siregar", nis: "2204008", tanggal_lahir: "2001-08-22", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Lutfi Hidayatullah", nis: "2204007", tanggal_lahir: "2000-03-11", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Sitompul Panjaitan", nis: "2204006", tanggal_lahir: "1998-07-19", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Rizky Firmansyah", nis: "2204005", tanggal_lahir: "1999-11-30", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Adzkiya Hutabarat", nis: "2203004", tanggal_lahir: "2000-02-14", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Andi Muhammad Putra", nis: "2204003", tanggal_lahir: "2001-09-25", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Dony Ramadhan", nis: "2204002", tanggal_lahir: "1998-06-13", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Deni Rahman", nis: "2204001", tanggal_lahir: "2000-10-05", jenjang_studi: "04", tahun_masuk: "2022", password: "user123" },
    { nama: "Wahyu Waluyo", nis: "2103001", tanggal_lahir: "1999-04-23", jenjang_studi: "03", tahun_masuk: "2021", password: "user123" },
    { nama: "Budi Setiawan", nis: "2103002", tanggal_lahir: "2000-01-12", jenjang_studi: "03", tahun_masuk: "2021", password: "user123" },
    { nama: "Joko Susilo", nis: "2103003", tanggal_lahir: "2001-07-29", jenjang_studi: "03", tahun_masuk: "2021", password: "user123" },
    { nama: "Agung Prasetyo", nis: "2103004", tanggal_lahir: "1999-10-18", jenjang_studi: "03", tahun_masuk: "2021", password: "user123" },
    { nama: "Umar Syahputra", nis: "2103005", tanggal_lahir: "1998-02-05", jenjang_studi: "03", tahun_masuk: "2021", password: "user123" },
    { nama: "Panji Prasetyo", nis: "2203006", tanggal_lahir: "2000-08-01", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Fajar Alamsyah", nis: "2203007", tanggal_lahir: "1999-12-20", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Imam Maulana", nis: "2203008", tanggal_lahir: "2001-11-14", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Tina Arisandi", nis: "2203009", tanggal_lahir: "1998-09-09", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" },
    { nama: "Ali", nis: "2203010", tanggal_lahir: "2000-05-07", jenjang_studi: "03", tahun_masuk: "2022", password: "user123" }
];

// Fungsi untuk memvalidasi login berdasarkan NIS dan password
const authenticateUser = (nis, password) => {
    return santri.find(s => s.nis === nis && s.password === password);
};

// Route untuk login
app.post('/login', (req, res) => {
    const { nis, password } = req.body;  // Ambil NIS dan password dari body request
    const user = authenticateUser(nis, password);  // Cek apakah NIS dan password valid
    if (user) {
        res.json({ message: 'Login berhasil', user: user.nama });
    } else {
        res.status(401).json({ message: 'NIS atau password salah' });
    }
});

// Route untuk mengakses data dummy dengan nama jenjang studi
app.get('/api/santri', (req, res) => {
    const dataDenganJenjang = santri.map(item => ({
        ...item,
        nama_jenjang_studi: getJenjangStudi(item.jenjang_studi)  // Menambahkan nama jenjang studi
    }));
    res.json(dataDenganJenjang);
});

// Route untuk root URL (menangani GET /)
app.get('/', (req, res) => {
    res.send('Selamat datang di API Santri! Gunakan /api/santri untuk mengakses data.');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`API berjalan di http://localhost:${port}`);
});