import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import CountUp from 'react-countup';
import { MdiUser } from '../components/MdiUser'; // Import MdiUser
import Sidebar from '../components/Sidebar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SantriPage = () => {
    const [user, setUser] = useState({ name: '', role: '' });
    const [totalSantri, setTotalSantri] = useState(0);
    const [santriAktif, setSantriAktif] = useState(0);
    const [santriNonaktif, setSantriNonaktif] = useState(0);
    const [santri, setSantri] = useState([]);
    const [newSantri, setNewSantri] = useState({ nama: '', tanggal_lahir: '', jenjang_studi: '', tahun_masuk: '' });
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 1000, // durasi animasi dalam milidetik
            once: true,     // animasi hanya terjadi sekali saat scroll
        });
    }, []);

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
                setSantri(data);
                setTotalSantri(data.length);
                setSantriAktif(data.filter(s => s.tahun_masuk >= '2020').length);
                setSantriNonaktif(data.filter(s => s.tahun_masuk < '2020').length);
            })
            .catch(error => console.error('Error fetching santri data:', error));
    }, [navigate]);

    const generateNIS = () => {
        return 'NIS' + Math.floor(1000 + Math.random() * 9000); // Generate NIS secara otomatis
    };

    const handleAddSantri = () => {
        const generatedNIS = generateNIS();
        const newSantriWithNIS = { ...newSantri, nis: generatedNIS };

        // Tambahkan data santri baru ke state santri
        setSantri(prevSantri => [...prevSantri, newSantriWithNIS]);
        setTotalSantri(totalSantri + 1);
        if (newSantri.tahun_masuk >= '2020') {
            setSantriAktif(santriAktif + 1);
        } else {
            setSantriNonaktif(santriNonaktif + 1);
        }
        // Reset form input
        setNewSantri({ nama: '', tanggal_lahir: '', jenjang_studi: '', tahun_masuk: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSantri(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditSantri = (index) => {
        const updatedSantri = prompt('Edit Nama Santri:', santri[index].nama);
        if (updatedSantri) {
            setSantri(prevSantri => {
                const updatedList = [...prevSantri];
                updatedList[index].nama = updatedSantri;
                return updatedList;
            });
        }
    };

    const handleDeleteSantri = (index) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus santri ini?')) {
            setSantri(prevSantri => prevSantri.filter((_, i) => i !== index));
            setTotalSantri(totalSantri - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar user={user} />

            {/* Konten Santri */}
            <div className="w-3/4 p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Data Santri</h2>
                    <LogoutButton />
                </div>

                <div className="flex justify-end mt-4">
                    <Clock />
                </div>

                <div className="mt-8 grid grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center" data-aos="fade-up">
                        <MdiUser color="blue" className="text-4xl mx-auto mb-4" />
                        <div className="text-2xl font-bold text-teal-800">
                            <CountUp end={totalSantri} duration={3} />
                        </div>
                        <p className="text-gray-600">Total Santri</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-center" data-aos="fade-up">
                        <MdiUser color="green" className="text-4xl mx-auto mb-4" />
                        <div className="text-2xl font-bold text-green-500">
                            <CountUp end={santriAktif} duration={3} />
                        </div>
                        <p className="text-gray-600">Santri Aktif</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 text-center" data-aos="fade-up">
                        <MdiUser color="red" className="text-4xl mx-auto mb-4" />
                        <div className="text-2xl font-bold text-red-500">
                            <CountUp end={santriNonaktif} duration={3} />
                        </div>
                        <p className="text-gray-600">Santri Nonaktif</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Tambah Santri Baru</h3>
                    <div className="mt-4 bg-white shadow-md rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="nama"
                                placeholder="Nama"
                                value={newSantri.nama}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="date"
                                name="tanggal_lahir"
                                placeholder="Tanggal Lahir"
                                value={newSantri.tanggal_lahir}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="jenjang_studi"
                                placeholder="Jenjang Studi"
                                value={newSantri.jenjang_studi}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="tahun_masuk"
                                placeholder="Tahun Masuk"
                                value={newSantri.tahun_masuk}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleAddSantri}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Tambah Santri
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold">Daftar Santri</h3>
                    <table className="min-w-full table-auto bg-white shadow-md rounded-lg mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">NIS</th>
                                <th className="px-4 py-2 text-left">Nama</th>
                                <th className="px-4 py-2 text-left">Tanggal Lahir</th>
                                <th className="px-4 py-2 text-left">Jenjang Studi</th>
                                <th className="px-4 py-2 text-left">Tahun Masuk</th>
                                <th className="px-4 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {santri.map((s, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{s.nis}</td>
                                    <td className="border px-4 py-2">{s.nama}</td>
                                    <td className="border px-4 py-2">{s.tanggal_lahir}</td>
                                    <td className="border px-4 py-2">{s.jenjang_studi}</td>
                                    <td className="border px-4 py-2">{s.tahun_masuk}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleEditSantri(index)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSantri(index)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SantriPage;
