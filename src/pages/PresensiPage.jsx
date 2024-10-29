import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Swal from 'sweetalert2';
import PresensiTable from '../components/PresensiTable'; // Import komponen PresensiTable
import Sidebar from '../components/Sidebar';
import { useApiUrl } from '../lib/api';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

const PresensiPage = () => {
    const cookies = new Cookies();
    const [user, setUser] = useState({ name: 'Loading...', role: '' });
    const [presensi, setPresensi] = useState([]);
    const [selectedSession, setSelectedSession] = useState('subuh');
    const navigate = useNavigate();
    const url = useApiUrl();

    useEffect(() => {
        const token = cookies.get('token');
        if(!token) navigate('/login');
        const storedUser = jwtDecode(token);
        if (storedUser.data) {
            setUser(storedUser.data);
        } else {
            navigate('/login');
        }
        async function fetchSantriData() {
            try {
                const response = await fetch(`${url}/api/santri`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedData = data
                        .filter(s => s.nama && s.nis)
                        .map(s => ({ nama: s.nama, nis: s.nis }))
                        .sort((a, b) => a.nama.localeCompare(b.nama));
                    
                    setPresensi(sortedData.map(s => ({ ...s, status: 'Hadir' })));
                } else {
                    console.error('Invalid data structure:', data);
                }
            } catch (error) {
                console.error('Error fetching santri data:', error);
            }
        }
        fetchSantriData()
    }, [navigate]);

    const handleStatusChange = (nis, newStatus) => {
        setPresensi(prevPresensi =>
            prevPresensi.map(p => p.nis === nis ? { ...p, status: newStatus } : p)
        );
    };

    const handleSavePresensi = () => {
        const token = cookies.get('token');
        const user = jwtDecode(token);
        const storedUser = user.data

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

                fetch(`${url}/api/presensi`, {
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
            <Sidebar user={user} />

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
