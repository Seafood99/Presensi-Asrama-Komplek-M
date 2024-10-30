import express from 'express';
import cors from 'cors';

const app = express();
const port = 4100;

// Gunakan middleware CORS dan parsing JSON
app.use(cors({
    origin: 'http://localhost:5173' // Sesuaikan dengan URL dari React Vite Anda
}));

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
// Fungsi untuk menghasilkan data presensi acak
function generateRandomPresensi(santri) {
    const presensi = [];
    const statuses = ['Hadir', 'Sakit', 'Izin', 'Absen'];
    const startDate = new Date('2024-09-24');
    const endDate = new Date('2024-10-31');

    let currentDate = new Date(startDate.getTime());
    while (currentDate <= endDate) {
        santri.forEach((s) => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            presensi.push({
                id: presensi.length + 1,
                nis: s.nis,
                tanggal: currentDate.toISOString().slice(0, 10),
                status: status,
            });
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return presensi;
}

// Menghasilkan data presensi
let presensi = generateRandomPresensi(santri);

// Fungsi untuk memvalidasi login berdasarkan NIS dan password
const authenticateUser = (nis, password) => {
    return santri.find(s => s.nis === nis && s.password === password);
};

// Middleware untuk validasi admin
// const isAdmin = (req, res, next) => {
//     const { nis, password } = req.body;

//     console.log('Request Body:', req.body); // Tambahkan log untuk mencetak request body

//     const user = authenticateUser(nis, password);
//     if (user && user.role === 'admin') {
//         console.log('Authenticated as admin'); // Log ketika berhasil sebagai admin
//         next();  // Jika admin, lanjutkan
//     } else {
//         console.log('Failed authentication as admin'); // Log ketika gagal autentikasi
//         res.status(403).json({ message: 'Unauthorized: Only admins can perform this action.' });
//     }
// };

const isAdmin = (req, res, next) => {
    const { nis, password } = req.body;

    console.log('Request Body:', req.body); // Log isi dari request body

    // Coba cari user
    const user = authenticateUser(nis, password);

    if (user) {
        console.log('User ditemukan:', user);
    } else {
        console.log('User tidak ditemukan.');
    }

    if (user && user.role === 'admin') {
        console.log('Authenticated as admin'); // Log ketika berhasil sebagai admin
        next();  // Jika admin, lanjutkan
    } else {
        console.log('Failed authentication as admin'); // Log ketika gagal autentikasi
        res.status(403).json({ message: 'Unauthorized: Only admins can perform this action.' });
    }
};


// Route untuk mendapatkan data presensi berdasarkan tanggal tertentu
app.get('/api/santri/presensi', (req, res) => {
    const { tanggal } = req.query;

    if (tanggal) {
        // Filter data presensi berdasarkan tanggal yang diberikan
        const filteredPresensi = presensi.filter(p => p.tanggal === tanggal);
        res.json(filteredPresensi);
    } else {
        // Jika tidak ada tanggal, kembalikan semua data presensi
        res.json(presensi);
    }
});


// Route untuk login
app.post('/login', (req, res) => {
    const { nis, password } = req.body;
    const user = authenticateUser(nis, password);

    if (user) {
        console.log('user authenticated', user);
        // Mengirimkan nama dan role ke frontend
        res.json({ message: 'Login berhasil', user: user.nama, role: user.role });
    } else {
        console.log('user tidak ditemukan');
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

// Route untuk menambah data presensi (hanya untuk admin)
// 

// app.post('/api/presensi', (req, res) => {
//     console.log('Admin authenticated, saving presensi.');
//     const { nis, tanggal, status } = req.body;
//     const newPresensi = {
//         id: presensi.length + 1,
//         nis,
//         tanggal,
//         status
//     };
//     presensi.push(newPresensi);
//     res.status(201).send(newPresensi);
// });

app.post('/api/presensi', isAdmin, (req, res) => {
    const { presensi } = req.body;

    presensi.forEach(p => {
        const newPresensi = {
            id: presensi.length + 1,
            nis: p.nis,
            tanggal: p.tanggal,
            status: p.status,
            sesi: p.sesi // Menambahkan sesi subuh atau maghrib
        };
        presensi.push(newPresensi);
    });

    res.status(201).send({ message: 'Presensi saved successfully.' });
});


app.get('/api/santri/presensi', (req, res) => {
    const { tanggal, sesi, nis } = req.query;

    let filteredPresensi = presensi;

    if (tanggal) {
        filteredPresensi = filteredPresensi.filter(p => p.tanggal === tanggal);
    }

    if (sesi) {
        filteredPresensi = filteredPresensi.filter(p => p.sesi === sesi);
    }

    if (nis) {
        filteredPresensi = filteredPresensi.filter(p => p.nis === nis);
    }

    res.json(filteredPresensi);
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

// Route untuk summary (contoh)
app.get("/api/summary", (req, res) => {
    const totalSantri = santri.length;
    const totalPresensi = presensi.length;
    const totalHadir = presensi.filter(p => p.status === 'Hadir').length;
    const totalTidakHadir = presensi.filter(p => p.status !== 'Hadir').length;

    res.json({
        totalSantri,
        totalPresensi,
        totalHadir,
        totalTidakHadir
    });
});

// Route untuk root URL (menangani GET /)
app.get('/', (req, res) => {
    res.send('Selamat datang di API Santri! Gunakan /api/santri untuk mengakses data.');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`API berjalan di http://localhost:${port}`);
});
