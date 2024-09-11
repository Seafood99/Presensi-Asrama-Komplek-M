import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import component
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';



const Dashboard = () => {
    const [user, setUser] = useState({ name: '', role: '' });
    const navigate = useNavigate();

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
                    <span className="text-sm text-white">{user.role}</span>  {/* Tampilkan role */}
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
                            <Link to="/presensi" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/checklist.svg" alt="Logo Presensi" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Presensi</span>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link to="/santri" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/user.svg" alt="Logo Santri" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Santri</span>
                            </Link>
                        </li>
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
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded">Ngaji Ba'da Subuh</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Ngaji Ba'da Maghrib</button>
                </div>

                {/* Tabel Presensi */}
                <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Presensi Ba'da Subuh</h3>
                    <table className="table-auto w-full text-left">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Nama Santri</th>
                                <th className="border px-4 py-2">Presensi Ngaji Ba'da Subuh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {["Ahmad Faiz", "Ahmad Faiz", "Ahmad Faiz", "Ahmad Faiz", "Ahmad Faiz"].map((name, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{name}</td>
                                    <td className="border px-4 py-2">Hadir</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
