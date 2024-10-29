import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Swal from 'sweetalert2';
import PresensiTable from '../components/PresensiTable'; // Import komponen PresensiTable
import Sidebar from '../components/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PresensiPage = () => {
    const [user, setUser] = useState({ name: 'Loading...', role: '' });
    const [presensi, setPresensi] = useState([]);
    const [selectedSession, setSelectedSession] = useState('subuh');
    const [selectedDate, setSelectedDate] = useState(new Date()); // Tanggal untuk input presensi saat ini
    const [previousPresensi, setPreviousPresensi] = useState([]); // Data presensi untuk tanggal sebelumnya
    const [previousDate, setPreviousDate] = useState(new Date()); // Tanggal untuk melihat presensi sebelumnya
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
        console.log('Stored User:', storedUser);  // Debugging untuk memastikan user yang disimpan

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
                    nis: storedUser.nis,  // Pastikan `nis` sesuai dengan admin
                    password: 'admin123', // Pastikan `password` sesuai dengan admin
                    presensi: presensi.map((p) => ({
                        ...p,
                        sesi: selectedSession  // Menyimpan sesi subuh atau maghrib
                    }))
                };

                console.log('Request Body:', requestBody);  // Debugging untuk melihat body request

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
                    .then((_data) => {
                        Swal.fire('Tersimpan!', 'Presensi telah berhasil disimpan.', 'success');
                    })
                    .catch((error) => {
                        Swal.fire('Error!', 'Gagal menyimpan presensi: ' + error.message, 'error');
                    });
            }
        });
    };

    // Fungsi untuk mengambil data presensi tanggal sebelumnya
    const handleFetchPreviousPresensi = async () => {
        try {
            const formattedDate = previousDate.toISOString().split('T')[0];
            const response = await fetch(`http://localhost:4100/api/santri/presensi?tanggal=${formattedDate}&sesi=${selectedSession}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                const sortedData = data
                    .filter(s => s.nama && s.nis && s.status) // Filter data yang valid
                    .map(s => ({ nama: s.nama, nis: s.nis, status: s.status }))
                    .sort((a, b) => a.nama.localeCompare(b.nama));

                setPreviousPresensi(sortedData);
            } else {
                console.error('Invalid data structure:', data);
            }
        } catch (error) {
            console.error('Error fetching previous presensi data:', error);
        }
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

                <div className="mt-8 flex gap-4 items-center">
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

                {/* Tabel Input Presensi */}
                <PresensiTable presensi={presensi} user={user} handleStatusChange={handleStatusChange} />

                {user.role === 'admin' && (
                    <div className="mt-6">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSavePresensi}>
                            Simpan Presensi
                        </button>
                    </div>
                )}

                {/* Bagian untuk Melihat Presensi Tanggal Sebelumnya */}
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4">Lihat Presensi Tanggal Sebelumnya</h3>
                    <div className="flex gap-4 items-center">
                        <DatePicker
                            selected={previousDate}
                            onChange={(date) => setPreviousDate(date)}
                            className="p-2 border rounded"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleFetchPreviousPresensi}
                        >
                            Lihat Presensi
                        </button>
                    </div>

                    {previousPresensi.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-xl font-semibold">Data Presensi Tanggal {previousDate.toISOString().split('T')[0]}</h4>
                            <PresensiTable presensi={previousPresensi} user={{ role: 'viewer' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PresensiPage;
