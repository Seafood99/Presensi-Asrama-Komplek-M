import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import komponen
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import PresensiTable from '../components/PresensiTable';  // Import PresensiTable

const Dashboard = () => {
    const [user, setUser] = useState({ name: '', role: '' });
    const [presensiSubuh, setPresensiSubuh] = useState([]);
    const [presensiMaghrib, setPresensiMaghrib] = useState([]);
    const [selectedSession, setSelectedSession] = useState('subuh'); // State untuk sesi
    const navigate = useNavigate();

    useEffect(() => {
        // Ambil data presensi untuk Ngaji Ba'da Subuh
        fetch('http://localhost:4100/api/santri')  // Anda bisa sesuaikan URL API jika perlu
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sortedSubuhData = data
                        .filter(s => s.nama && s.nis)
                        .map(s => ({ nama: s.nama, nis: s.nis, status: 'Hadir' }))  // Status dummy
                        .sort((a, b) => a.nama.localeCompare(b.nama));
                    setPresensiSubuh(sortedSubuhData);
                }
            })
            .catch(error => console.error(error));
        
        // Ambil data presensi untuk Ngaji Ba'da Maghrib
        fetch('http://localhost:4100/api/santri')  // Anda bisa sesuaikan URL API jika berbeda
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sortedMaghribData = data
                        .filter(s => s.nama && s.nis)
                        .map(s => ({ nama: s.nama, nis: s.nis, status: 'Hadir' }))  // Status dummy
                        .sort((a, b) => a.nama.localeCompare(b.nama));
                    setPresensiMaghrib(sortedMaghribData);
                }
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        // Ambil data pengguna dari localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));  // Parse data JSON dari localStorage
        } else {
            // Redirect ke login jika tidak ada data user
            navigate('/login');
        }
    }, [navigate]);

    // Tentukan data presensi yang ditampilkan berdasarkan sesi yang dipilih
    const displayedPresensi = selectedSession === 'subuh' ? presensiSubuh : presensiMaghrib;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-teal-800 p-4">
                {/* Logo Pesantren */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Komplek M Al-Busyro</h1>
                </div>
                {/* Profil Admin */}
                <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
                    <h2 className="text-lg text-white mt-4 font-semibold">{user.name}</h2>
                    <span className="text-sm text-white">{user.role}</span>
                    <div className="mt-4">
                        <button className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Lihat Profil</button>
                        <button className="bg-blue-500 text-white px-4 py-1 rounded">Foto Profil</button>
                    </div>
                </div>
                {/* Menu Sidebar */}
                <nav>
                    <ul>
                        <li className="mb-2">
                            <Link to="/dashboard" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/home.svg" alt="Logo Home" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Dashboard</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/panduan" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/book-bookmark-fill.svg" alt="Logo Panduan" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Panduan Website</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/Presensi" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/checklist.svg" alt="Logo Presensi" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Presensi</span>
                            </Link>
                        </li>
                        {user.role === 'admin' && (
                            <li className="mb-2">
                                <Link to="/santri" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                    <img src="src/assets/user.svg" alt="Logo Santri" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                    <span className="text-white">Santri</span>
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Konten Dashboard */}
            <div className="w-3/4 p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Dashboard Presensi</h2>
                    <LogoutButton />  {/* Tombol Logout */}
                </div>

                {/* Realtime Clock */}
                <div className="flex justify-end mt-4">
                    <Clock />  {/* Komponen Jam Realtime */}
                </div>

                {/* Tombol filter presensi */}
                <div className="mt-8 flex gap-4">
                    <button 
                        className={`bg-yellow-500 text-white px-4 py-2 rounded ${selectedSession === 'subuh' ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedSession('subuh')} // Pilih sesi Ba'da Subuh
                    >
                        Ngaji Ba'da Subuh
                    </button>
                    <button 
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${selectedSession === 'maghrib' ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedSession('maghrib')} // Pilih sesi Ba'da Maghrib
                    >
                        Ngaji Ba'da Maghrib
                    </button>
                </div>

                {/* Tampilkan tabel presensi */}
                <PresensiTable presensi={displayedPresensi} user={user} handleStatusChange={() => {}} />  {/* Tidak ada fungsi edit */}
            </div>
        </div>
    );
};

export default Dashboard;
