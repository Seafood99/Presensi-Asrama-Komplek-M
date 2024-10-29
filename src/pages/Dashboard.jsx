import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';
import MyCalendar from '../components/MyCalender';
import CountUp from 'react-countup';
import { MdiUser } from '../components/MdiUser';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [user, setUser] = useState({ name: '', role: '' });
    const [date, setDate] = useState(new Date());
    const [presensi, setPresensi] = useState({ hadir: 0, sakit: 0, izin: 0, absen: 0 });

    const colorMap = {
        hadir: 'green',
        sakit: '#FCCD2A',
        izin: 'blue',
        absen: 'red'
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Mengambil data presensi dari API berdasarkan tanggal
    const handleDateChange = async (newDate) => {
        setDate(newDate);

        try {
            const response = await fetch(`http://localhost:4100/api/santri/presensi?tanggal=${newDate}`);
            const data = await response.json();

            let total = {
                hadir: 0,
                sakit: 0,
                izin: 0,
                absen: 0
            };

            data.forEach((item) => {
                if (item.status === 'Hadir') {
                    total.hadir += 1;
                } else if (item.status === 'Sakit') {
                    total.sakit += 1;
                } else if (item.status === 'Izin') {
                    total.izin += 1;
                } else if (item.status === 'Absen') {
                    total.absen += 1;
                }
            });

            setPresensi(total);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Sidebar user={user} />
            <div className="w-3/4 p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Selamat Datang {user.name}</h2>
                    <LogoutButton />
                </div>
                <div className="flex justify-end mt-4">
                    <Clock />
                </div>
                <div className="mt-8 grid grid-cols-4 gap-4">
                    {Object.keys(presensi).map((key, index) => (
                        <div key={key} className="bg-white shadow-md rounded-lg p-6 text-center" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                            <MdiUser color={colorMap[key]} className="text-4xl mx-auto mb-4" />
                            <div className="text-2xl font-bold" style={{ color: colorMap[key] }}>
                                <CountUp end={presensi[key]} duration={3} />
                            </div>
                            <p className="text-gray-600">Santri {key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <MyCalendar changeDate={handleDateChange} nis={user.nis} role={user.role} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
