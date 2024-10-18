import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CountUp from 'react-countup';
import { MdiUser } from '../components/MdiUser';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const cookies = new Cookies();
    const [user, setUser] = useState({ name: '', role: '' });
    const [date, setDate] = useState(new Date());
    const [presensi, setPresensi] = useState({ hadir: 0, sakit: 0, izin: 0, absen: 0 });

    const colorMap = {
        hadir: 'green',
        sakit: 'yellow',
        izin: 'blue',
        absen: 'red'
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
        handleDateChange(date);
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies.get('token');
        const user = jwtDecode(token);
        const storedUser = user.data;
        console.log(storedUser)
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleDateChange = (newDate) => {
        setDate(newDate);

        const baseHadir = 5 + (newDate.getDate() % 3);
        const sisa = 11 - baseHadir;
        const randomSplit = (total, parts) => {
            let remain = total;
            let result = [];
            for (let i = 0; i < parts - 1; i++) {
                const part = Math.floor(Math.random() * (remain + 1));
                result.push(part);
                remain -= part;
            }
            result.push(remain);
            return result;
        };

        new Promise((resolve) => {
            setTimeout(() => {
                const [sakit, izin, absen] = randomSplit(sisa, 3);
                resolve({
                    hadir: baseHadir,
                    sakit,
                    izin,
                    absen
                });
            }, 300);
        }).then((newPresensi) => {
            setPresensi(newPresensi);
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar user={user} />
            
            <div className="w-3/4 p-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Dashboard Presensi</h2>
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

                <div className='mt-8'>
                    <Calendar onChange={handleDateChange} value={date} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
