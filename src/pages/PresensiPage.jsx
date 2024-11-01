import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Swal from 'sweetalert2';
import PresensiTable from '../components/PresensiTable'; // Import komponen PresensiTable
import Sidebar from '../components/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";


Modal.setAppElement('#root');

const PresensiPage = () => {
    const cookies = new Cookies();
    const [user, setUser] = useState({ name: 'Loading...', role: '' });
    const [presensi, setPresensi] = useState([]);
    const [santri, setSantri] = useState([]);
    const [selectedSession, setSelectedSession] = useState('subuh');
    const [selectedDate, setSelectedDate] = useState(new Date()); // Tanggal untuk input presensi saat ini
    const [previousPresensi, setPreviousPresensi] = useState([]); // Data presensi untuk tanggal sebelumnya
    const [previousDate, setPreviousDate] = useState(new Date()); // Tanggal untuk melihat presensi sebelumnya
    const [showModal, setShowModal] = useState(false); // State untuk modal izin
    const [isOpen, setIsOpen] = useState(false);
    const [izinData, setIzinData] = useState({
        nama: '',
        nis: '',
        jenis: 'tidak mengaji ba\'da subuh',
        keterangan: '',
        dari: new Date(),
        sampai: new Date()
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies.get('token');
        if(!token) navigate('/login');
        const storedUser = jwtDecode(token);
        if (storedUser.data) {
            setUser(storedUser.data);
        } else {
            navigate('/login');
        }
        // Fetch data santri dari API
        fetch('https://strong-aphid-joint.ngrok-free.app/api/santri', {headers
            : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get("token")}`
    }})
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    // const sortedData = data
                    //     .filter(s => s.nama && s.nis)
                    //     .map(s => ({ nama: s.nama, nis: s.nis }))
                    //     .sort((a, b) => a.nama.localeCompare(b.nama));
                    setSantri(data.data);
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

                fetch('https://strong-aphid-joint.ngrok-free.app/api/presensi', {
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

    const handleFetchPreviousPresensi = async () => {
        try {
            const formattedDate = previousDate.toISOString().split('T')[0];
            const response = await fetch(`https://strong-aphid-joint.ngrok-free.app/api/presensi`,{
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get("token")}`
            }});
            const data = await response.json();
            console.log(data)
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

    const handleIzinClick = () => {
        setShowModal(true);
    };

    const handleIzinSubmit = () => {
        Swal.fire('Permintaan Izin', 'Permintaan izin telah dikirim.', 'success');
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {isOpen &&
                <button className="md:hidden absolute top-4 right-4" onClick={()=>setIsOpen(isOpen => !isOpen)}>
                    <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            }
            <Sidebar user={user} opened={isOpen} />

            <div className="md:w-3/4 w-full p-8 md:ms-[28rem]">
                <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center">
                        <section className="flex gap-x-3">
                            <button onClick={()=>setIsOpen(isOpen => !isOpen)} className='md:hidden block'>
                            <svg
                                class="w-6 h-6 text-gray-800"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M5 7h14M5 12h14M5 17h14"
                                />
                            </svg>
                            </button>
                            <h2 className="md:text-3xl text-xl font-bold">Presensi Ngaji {selectedSession === 'subuh' ? "Ba'da Subuh" : "Ba'da Maghrib"}</h2>
                        </section>
                        <LogoutButton />
                    </div>
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
                <PresensiTable presensi={santri} user={cookies.get('token')}/>


                {user.role === 'user' && (
                    <div className="mt-6">
                        <button className="bg-teal-700 text-white px-4 py-2 rounded" onClick={handleIzinClick}>
                            Ingin Izin? Klik Disini
                        </button>
                    </div>
                )}

            </div>

            {/* Modal untuk Izin */}
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Form Izin"
                className="bg-white p-8 rounded-md shadow-md w-full max-w-md m-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Form Izin</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={user.name}
                        value={izinData.nama}
                        disabled
                        onChange={(e) => setIzinData({ ...izinData, nama: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={user.nis}
                        value={izinData.nis}
                        disabled
                        onChange={(e) => setIzinData({ ...izinData, nis: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={izinData.jenis}
                        onChange={(e) => setIzinData({ ...izinData, jenis: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    >
                        <option value="tidak mengaji ba'da subuh">Tidak Mengaji Ba'da Subuh</option>
                        <option value="tidak mengaji ba'da maghrib">Tidak Mengaji Ba'da Maghrib</option>
                        <option value="tidak bermalam diasrama">Tidak Bermalam di Asrama</option>
                    </select>
                </div>
                <div className="mb-4">
                    <textarea
                        placeholder="Keterangan (maksimal 200 karakter)"
                        value={izinData.keterangan}
                        onChange={(e) => setIzinData({ ...izinData, keterangan: e.target.value })}
                        maxLength={200}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Dari Tanggal:</label>
                    <DatePicker
                        selected={izinData.dari}
                        onChange={(date) => setIzinData({ ...izinData, dari: date })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Sampai Tanggal:</label>
                    <DatePicker
                        selected={izinData.sampai}
                        onChange={(date) => setIzinData({ ...izinData, sampai: date })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => setShowModal(false)}
                        className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleIzinSubmit}
                        className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800"
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PresensiPage;
