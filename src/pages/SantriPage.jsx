import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import CountUp from 'react-countup';
import { MdiUser } from '../components/MdiUser'; // Import MdiUser
import Sidebar from '../components/Sidebar';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Cookies from 'universal-cookie';
import {jwtDecode} from "jwt-decode";
import useSWR from 'swr';

const SantriPage = () => {
    const url = "http://203.194.113.18:4100";
    const cookies = new Cookies();
    const fetcher = (url) => fetch(url, {
        headers: {
            'Authorization': `Bearer ${cookies.get("token")}`
        }
    }).then((res) => res.json());

    const [user, setUser] = useState({ name: '', role: '' });
    const [newSantri, setNewSantri] = useState({ name: '', birthdate: '', registration_year: '', study_level: '' });
    const navigate = useNavigate();

    // Use SWR to fetch data
    const { data: santri, error } = useSWR(`${url}/api/santri`, fetcher, {
        revalidateOnFocus: false,  // Re-fetch when window gets focus
        dedupingInterval: 1000 * 60 * 5, // Avoid refetching for 5 minutes
    });

    // Calculate totalSantri, santriAktif, santriNonaktif based on fetched santri data
    const totalSantri = santri ? santri.data.length : 0;
    const santriAktif = santri ? santri.data.filter(s => s.registration_year >= '2020').length : 0;
    const santriNonaktif = santri ? santri.data.filter(s => s.registration_year < '2020').length : 0;

    useEffect(() => {
        AOS.init({
            duration: 1000,  // animation duration in milliseconds
            once: true,      // animation triggers only once on scroll
        });
    }, []);

    useEffect(() => {
        const token = cookies.get('token');
        if (!token) {
            navigate('/login');
            return;
        }
        // Decode the JWT token to get user information
        const decodedToken = jwtDecode(token);
        const storedUser = decodedToken.data;

        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSantri({ ...newSantri, [name]: value });
    };

    const handleAddSantri = async () => {
        try {
            const nis = newSantri.registration_year+newSantri.study_level
            const new_newSantri = {...newSantri, nis}
            const response = await fetch(`${url}/api/santri`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get("token")}`
                },
                body: JSON.stringify(new_newSantri)
            });
            if (!response.ok) {
                throw new Error('Failed to add new santri');
            }
            alert('Santri berhasil ditambahkan!');
            setNewSantri({ name: '', birthdate: '', registration_year: '', study_level: '' });
        } catch (error) {
            alert('Gagal menambahkan santri: ' + error.message);
        }
    };

    if (error) return <div>Error fetching santri data</div>;
    if (!santri) return <div>Loading...</div>;

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
                                name="name"
                                placeholder="Nama"
                                value={newSantri.name}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="date"
                                name="birthdate"
                                placeholder="Tanggal Lahir"
                                value={newSantri.birthdate}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <select
                                name="study_level"
                                value={newSantri.study_level}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            >
                                <option value="">Pilih Jenjang Studi</option>
                                <option value="01">SD</option>
                                <option value="02">SMP</option>
                                <option value="03">SMA</option>
                            </select>

                            <select
                                name="registration_year"
                                value={newSantri.registration_year}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            >
                                <option value="">Pilih tahun masuk</option>
                                <option value="22">2022</option>
                                <option value="23">2023</option>
                                <option value="24">2024</option>
                                <option value="25">2025</option>
                                <option value="26">2026</option>
                            </select>
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
                            </tr>
                        </thead>
                        <tbody>
                            {santri.data.map((s, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{s.nis}</td>
                                    <td className="border px-4 py-2">{s.name}</td>
                                    <td className="border px-4 py-2">{new Date(s.birthdate).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">{s.study_level}</td>
                                    <td className="border px-4 py-2">{s.registration_year}</td>
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
