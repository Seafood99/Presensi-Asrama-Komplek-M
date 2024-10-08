import express from 'express';
import cors from 'cors';

const app = express();
const port = 4100;

// Gunakan middleware CORS dan parsing JSON
app.use(cors());
app.use(express.json());

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
    // Data santri Anda tetap seperti yang sudah ada...

    {
        nama: "Achmad Wijdan Rabbani",
        nis: "240401",
        tanggal_lahir: "1999-08-25",
        jenjang_studi: "04",
        tahun_masuk: "2024",
        password: "user123",
        role: "user"
    },
    {
        nama: "Muhammad Alwi Khaidar",
        nis: "230406",
        tanggal_lahir: "2001-03-12",
        jenjang_studi: "04",
        tahun_masuk: "2023",
        password: "user123",
        role: "user"
    },
    {
        nama: "Muslihuddin Ahmad",
        nis: "230410",
        tanggal_lahir: "2001-11-05",
        jenjang_studi: "04",
        tahun_masuk: "2023",
        password: "user123",
        role: "user"
    },
    {
        nama: "Dhamar Galih",
        nis: "210404",
        tanggal_lahir: "1998-02-17",
        jenjang_studi: "04",
        tahun_masuk: "2021",
        password: "user123",
        role: "user"
    },
    {
        nama: "Ahmad Finaldi",
        nis: "220402",
        tanggal_lahir: "2000-06-18",
        jenjang_studi: "04",
        tahun_masuk: "2022",
        password: "user123",
        role: "user"
    },
    {
        nama: "Ahmad Khiznun Yuslih",
        nis: "240402",
        tanggal_lahir: "2000-04-20",
        jenjang_studi: "04",
        tahun_masuk: "2024",
        password: "user123",
        role: "user"
    },
    {
        nama: "Muhammad Jumadil Kubro",
        nis: "240403",
        tanggal_lahir: "1999-09-30",
        jenjang_studi: "04",
        tahun_masuk: "2024",
        password: "user123",
        role: "user"
    },
    {
        nama: "Syahirul Alim",
        nis: "240407",
        tanggal_lahir: "2000-12-15",
        jenjang_studi: "04",
        tahun_masuk: "2024",
        password: "user123",
        role: "user"
    },
    {
        nama: "Khoiruman Wahhada",
        nis: "210405",
        tanggal_lahir: "2005-07-08",
        jenjang_studi: "03",
        tahun_masuk: "2021",
        password: "user123",
        role: "user"
    },
    {
        nama: "Muhammad Rizqi Khoiruzzad",
        nis: "230408",
        tanggal_lahir: "2006-01-25",
        jenjang_studi: "03",
        tahun_masuk: "2023",
        password: "user123",
        role: "user"
    },
    {
        nama: "Muhammad Dawam Amali",
        nis: "220411",
        tanggal_lahir: "2000-05-15",
        jenjang_studi: "04",
        tahun_masuk: "2022",
        password: "admin123",
        role: "admin"
    }

];


// Inisialisasi data presensi
let presensi = [
    { id: 1, nis: "2204010", tanggal: "2024-09-18", status: "Hadir" },
    { id: 2, nis: "2203009", tanggal: "2024-09-18", status: "Tidak Hadir" }
];

// Fungsi untuk memvalidasi login berdasarkan NIS dan password
const authenticateUser = (nis, password) => {
    return santri.find(s => s.nis === nis && s.password === password);
};

const isAdmin = (req, res, next) => {
    const { nis, password } = req.body;

    console.log('Request Body:', req.body); // Tambahkan log untuk mencetak request body

    const user = authenticateUser(nis, password);
    if (user && user.role === 'admin') {
        console.log('Authenticated as admin'); // Log ketika berhasil sebagai admin
        next();  // Jika admin, lanjutkan
    } else {
        console.log('Failed authentication as admin'); // Log ketika gagal autentikasi
        res.status(403).json({ message: 'Unauthorized: Only admins can perform this action.' });
    }
};






// Route untuk login
app.post('/login', (req, res) => {
    const { nis, password } = req.body;
    const user = authenticateUser(nis, password);

    if (user) {
        // Mengirimkan nama dan role ke frontend
        res.json({ message: 'Login berhasil', user: user.nama, role: user.role });
    } else {
        res.status(401).json({ message: 'NIS atau password salah' });
    }
});

// Route untuk mendapatkan data santri dengan jenjang studi
app.get('/api/santri', (req, res) => {
    const dataDenganJenjang = santri.map(item => ({
        ...item,
        nama_jenjang_studi: getJenjangStudi(item.jenjang_studi)  // Menambahkan nama jenjang studi
    }));
    res.json(dataDenganJenjang);
});

// Route untuk mendapatkan semua data presensi
app.get('/api/presensi', (req, res) => {
    res.json(presensi);
});

// Route untuk menambah data presensi (hanya untuk admin)
app.post('/api/presensi', (req, res, next) => {
    console.log('Request Body:', req.body);  // Log request body sebelum middleware isAdmin
    next();  // Lanjutkan ke middleware isAdmin
}, isAdmin, (req, res) => {
    // Log sebelum menyimpan presensi
    console.log('Admin authenticated, saving presensi.');
    const { nis, tanggal, status } = req.body;
    const newPresensi = {
        id: presensi.length + 1,
        nis,
        tanggal,
        status
    };
    presensi.push(newPresensi);
    res.status(201).send(newPresensi);
});


// Route untuk memperbarui data presensi berdasarkan ID (hanya untuk admin)
app.put('/api/presensi/:id', isAdmin, (req, res) => {
    const { nis, tanggal, status } = req.body;
    const presensiIndex = presensi.findIndex(p => p.id === parseInt(req.params.id));
    if (presensiIndex !== -1) {
        presensi[presensiIndex] = { ...presensi[presensiIndex], nis, tanggal, status };
        res.send(presensi[presensiIndex]);
    } else {
        res.status(404).send('Presensi record not found.');
    }
});

// Route untuk menghapus data presensi berdasarkan ID (hanya untuk admin)
app.delete('/api/presensi/:id', isAdmin, (req, res) => {
    const presensiIndex = presensi.findIndex(p => p.id === parseInt(req.params.id));
    if (presensiIndex !== -1) {
        presensi.splice(presensiIndex, 1);
        res.send({ message: 'Presensi record deleted.' });
    } else {
        res.status(404).send('Presensi record not found.');
    }
});

// Route untuk root URL (menangani GET /)
app.get('/', (req, res) => {
    res.send('Selamat datang di API Santri! Gunakan /api/santri untuk mengakses data.');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`API berjalan di http://localhost:${port}`);
});
