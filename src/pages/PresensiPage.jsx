import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Swal from 'sweetalert2';
import PresensiTable from '../components/PresensiTable'; // Import komponen PresensiTable

const PresensiPage = () => {
    const [user, setUser] = useState({ name: 'Loading...', role: '' });
    const [presensi, setPresensi] = useState([]);
    const [selectedSession, setSelectedSession] = useState('subuh');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }

        // Fetch data santri dari API
        fetch('http://localhost:4100/api/santri')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sortedData = data
                        .filter(s => s.nama && s.nis)
                        .map(s => ({ nama: s.nama, nis: s.nis }))
                        .sort((a, b) => a.nama.localeCompare(b.nama));

                    setPresensi(sortedData.map(s => ({ ...s, status: 'Hadir' })));
                } else {
                    console.error('Invalid data structure:', data);
                }
            })
            .catch(error => console.error('Error fetching santri data:', error));
    }, [navigate]);

    const handleStatusChange = (nis, newStatus) => {
        setPresensi(prevPresensi =>
            prevPresensi.map(p => p.nis === nis ? { ...p, status: newStatus } : p)
        );
    };

    const handleSavePresensi = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda akan menyimpan presensi ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                const requestBody = {
                    nis: storedUser.nis,
                    password: 'admin123',
                    presensi: presensi,
                };

                fetch('http://localhost:4100/api/presensi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Unauthorized');
                        }
                        return response.json();
                    })
                    .then((data) => {
                        Swal.fire('Tersimpan!', 'Presensi telah berhasil disimpan.', 'success');
                    })
                    .catch((error) => {
                        Swal.fire('Error!', 'Gagal menyimpan presensi: ' + error.message, 'error');
                    });
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-1/4 bg-teal-800 p-4">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Komplek M Al-Busyro</h1>
                </div>
                <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
                    <h2 className="text-lg text-white mt-4 font-semibold">{user.name}</h2>
                    <span className="text-sm text-white">{user.role}</span>
                    <div className="mt-4">
                        <button className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Lihat Profil</button>
                        <button className="bg-blue-500 text-white px-4 py-1 rounded">Foto Profil</button>
                    </div>
                </div>
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

            <div className="w-3/4 p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Presensi Ngaji {selectedSession === 'subuh' ? "Ba'da Subuh" : "Ba'da Maghrib"}</h2>
                    <LogoutButton />
                </div>

                <div className="flex justify-end mt-4">
                    <Clock />
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        className={`bg-yellow-500 text-white px-4 py-2 rounded ${selectedSession === 'subuh' ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedSession('subuh')}
                        disabled={selectedSession === 'subuh'}
                    >
                        Presensi Ba'da Subuh
                    </button>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${selectedSession === 'maghrib' ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedSession('maghrib')}
                        disabled={selectedSession === 'maghrib'}
                    >
                        Presensi Ba'da Maghrib
                    </button>
                </div>

                {/* Gunakan komponen PresensiTable */}
                <PresensiTable presensi={presensi} user={user} handleStatusChange={handleStatusChange} />

                {user.role === 'admin' && (
                    <div className="mt-6">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSavePresensi}>
                            Simpan Presensi
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PresensiPage;
