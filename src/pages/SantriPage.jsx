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
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const SantriPage = () => {
    const url = useApiUrl();
    const cookies = new Cookies();
    const [user, setUser] = useState({ name: '', role: '' });
    const navigate = useNavigate();
    
    // Use SWR to fetch data
    const { data: santri, error } = useSWR(`${url}/api/santri`, fetcher, {
        revalidateOnFocus: false,  // Re-fetch when window gets focus
        dedupingInterval: 1000 * 60 * 5, // Avoid refetching for 5 minutes
    });

    // Calculate totalSantri, santriAktif, santriNonaktif based on fetched santri data
    const totalSantri = santri ? santri.length : 0;
    const santriAktif = santri ? santri.filter(s => s.tahun_masuk >= '2020').length : 0;
    const santriNonaktif = santri ? santri.filter(s => s.tahun_masuk < '2020').length : 0;

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
