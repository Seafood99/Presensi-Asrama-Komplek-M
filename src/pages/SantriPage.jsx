import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import CountUp from 'react-countup';
import { MdiUser } from '../components/MdiUser'; // Import MdiUser
import Sidebar from '../components/Sidebar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useApiUrl } from '../lib/api';

const SantriPage = () => {
    const [user, setUser] = useState({ name: '', role: '' });
    const [totalSantri, setTotalSantri] = useState(0);
    const [santriAktif, setSantriAktif] = useState(0);
    const [santriNonaktif, setSantriNonaktif] = useState(0);
    const [santri, setSantri] = useState([]);
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
        fetch(`${useApiUrl}/api/santri`)
            .then(response => response.json())
            .then(data => {
                setSantri(data);
                setTotalSantri(data.length);
                setSantriAktif(data.filter(s => s.tahun_masuk >= '2020').length);
                setSantriNonaktif(data.filter(s => s.tahun_masuk < '2020').length);
            })
            .catch(error => console.error('Error fetching santri data:', error));
    }, [navigate]);

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
                    <h3 className="text-xl font-semibold">Daftar Santri</h3>
                    <table className="min-w-full table-auto bg-white shadow-md rounded-lg mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">NIS</th>
                                <th className="px-4 py-2 text-left">Nama</th>
                                <th className="px-4 py-2 text-left">Tanggal Lahir</th>
                                <th className="px-4 py-2 text-left">Jenjang Studi</th>
                                <th className="px-4 py-2 text-left">Tahun Masuk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {santri.map((s, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{s.nis}</td>
                                    <td className="border px-4 py-2">{s.nama}</td>
                                    <td className="border px-4 py-2">{s.tanggal_lahir}</td>
                                    <td className="border px-4 py-2">{s.nama_jenjang_studi}</td>
                                    <td className="border px-4 py-2">{s.tahun_masuk}</td>
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
