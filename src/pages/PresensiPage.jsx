import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Swal from 'sweetalert2';
import PresensiTable from '../components/PresensiTable';
import Sidebar from '../components/Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import { useApiUrl } from '../helpers/apiUrl';

Modal.setAppElement('#root');

const fetcher = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  return response.json();
};

const PresensiPage = () => {
    const url = useApiUrl();
    const cookies = new Cookies();
    const token = cookies.get('token');
    const navigate = useNavigate();
    
    const [selectedSession, setSelectedSession] = useState('subuh');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [previousDate, setPreviousDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [izinData, setIzinData] = useState({
        nama: '',
        nis: '',
        jenis: 'tidak mengaji ba\'da subuh',
        keterangan: '',
        dari: new Date(),
        sampai: new Date()
    });

    // Fetch user data from token
    const user = token ? jwtDecode(token).data : null;
    if (!token || !user) {
        navigate('/login');
        return null;
    }

    // Fetch santri data using SWR
    const { data: santriData, error: santriError, mutate: mutateSantri } = useSWR(
        [`${url}/api/santri`, token],
        ([url, token]) => fetcher(url, token),
        { revalidateOnFocus: false, dedupingInterval: 1000 * 60 * 5 }
    );

    // Handle errors
    if (santriError) {
        if (santriError?.message === 'Unauthorized') {
            cookies.remove("token");
            navigate("/login");
            return null;
        }
        console.error('Error fetching data:', santriError);
    }

    const handleIzinSubmit = async () => {
        try {
            // Add your izin submission logic here
            Swal.fire('Permintaan Izin', 'Permintaan izin telah dikirim.', 'success');
            setShowModal(false);
            await mutatePresensi(); // Revalidate presensi data after submitting izin
        } catch (error) {
            Swal.fire('Error!', 'Gagal mengirim izin: ' + error.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {isOpen && (
                <button className="md:hidden absolute top-4 right-4" onClick={() => setIsOpen(isOpen => !isOpen)}>
                    <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
            )}
            <Sidebar user={user} opened={isOpen} />

            <div className="w-full p-8 md:ms-[28rem]">
                <div className="flex justify-between items-center">
                    <section className="flex gap-x-3">
                        <button onClick={() => setIsOpen(isOpen => !isOpen)} className='md:hidden block'>
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                            </svg>
                        </button>
                        <h2 className="md:text-3xl text-xl font-bold">Presensi Ngaji {selectedSession === 'subuh' ? "Ba'da Subuh" : "Ba'da Maghrib"}</h2>
                    </section>
                    <LogoutButton />
                </div>

                <div className="flex justify-end mt-4">
                    <Clock />
                </div>

                <section className='mt-8 flex justify-between items-center'>
                    <div className="flex gap-4 items-center">
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
                    <Link to={'/presensi'}>
                        <button className='bg-blue-500 rounded text-white px-4 py-2'>
                            Rekap Presensi Santri
                        </button>
                    </Link>
                </section>

                {/* Show loading state while data is being fetched */}
                {!santriData ? (
                    <div className="mt-8 text-center">Loading...</div>
                ) : santriError ? (
                    <div className="mt-8 text-center text-red-500">Error loading data</div>
                ) : (
                    <PresensiTable presensi={santriData.data} user={token} />
                )}

                {user.role === 'user' && (
                    <div className="mt-6">
                        <button className="bg-teal-700 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>
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
                        required
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
                        required
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={izinData.jenis}
                        onChange={(e) => setIzinData({ ...izinData, jenis: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                        required
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
                        required
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