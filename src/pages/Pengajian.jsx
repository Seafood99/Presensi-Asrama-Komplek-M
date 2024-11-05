// membuat halaman pengajian
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import LogoutButton from '../components/LogoutButton';
import Clock from '../components/Clock';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";

Modal.setAppElement('#root');

export default function Pengajian() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPengajian, setSelectedPengajian] = useState(null);
    const [kitabFile, setKitabFile] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get('token');

    // Mengambil data user dari token
    const user = token ? jwtDecode(token).data : null;
    if (!token || !user) {
        navigate('/login');
        return null;
    }

    // Daftar pengajian (dummy data)
    const pengajianList = [
        {
            id: 1,
            nama: 'Pengajian Rutin',
            pengasuh: 'Ustadz Abdul',
            hari: 'Senin',
            kitab: 'kitab_rutin.pdf',
            kitabLink: '/uploads/kitab_rutin.pdf'
        }
    ];

    // Membuka modal tambah pengajian
    const handleAddPengajian = () => {
        setIsAddModalOpen(true);
    };

    // Membuka modal detail pengajian
    const handleDetailPengajian = (pengajian) => {
        setSelectedPengajian(pengajian);
        setIsDetailModalOpen(true);
    };

    // Membuka modal edit pengajian
    const handleEditPengajian = (pengajian) => {
        setSelectedPengajian(pengajian);
        setIsEditModalOpen(true);
    };

    // Menyimpan file kitab dari input file
    const handleKitabFileChange = (e) => {
        setKitabFile(e.target.files[0]);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar user={user} opened={isOpen} />

            {/* Konten Utama */}
            <div className="w-full p-8 md:ms-[28rem]">
                <div className="flex justify-between items-center mb-4">
                    <section className="flex gap-x-3">
                        <button onClick={() => setIsOpen(isOpen => !isOpen)} className='md:hidden block'>
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold">Pengajian</h1>
                    </section>
                    <LogoutButton />
                </div>

                <div className="flex justify-end mt-4">
                    <Clock />
                </div>

                <div className="flex justify-between items-center mb-4 mt-5">
                    <h2 className="text-xl font-bold">Daftar Pengajian</h2>
                    {user.role === 'admin' && (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            onClick={handleAddPengajian}
                        >
                            Tambah Pengajian
                        </button>
                    )}
                </div>

                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Hari</th>
                            <th className="border px-4 py-2">Nama Pengajian</th>
                            <th className="border px-4 py-2">Pengasuh</th>
                            <th className="border px-4 py-2">Kitab</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pengajianList.map((pengajian) => (
                            <tr key={pengajian.id}>
                                <td className="border px-4 py-2">{pengajian.hari}</td>
                                <td className="border px-4 py-2">{pengajian.nama}</td>
                                <td className="border px-4 py-2">{pengajian.pengasuh}</td>
                                <td className="border px-4 py-2">
                                    <a
                                        href={pengajian.kitabLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {pengajian.kitab}
                                    </a>
                                </td>
                                <td className="border px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => handleDetailPengajian(pengajian)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                                    >
                                        Detail
                                    </button>
                                    {user.role === 'admin' && (
                                        <button
                                            onClick={() => handleEditPengajian(pengajian)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah Pengajian */}
            <Modal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                contentLabel="Tambah Pengajian"
                className="bg-white p-8 rounded-md shadow-md max-w-md m-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Tambah Pengajian</h2>
                {/* Form tambah pengajian */}
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nama Pengajian</label>
                        <input type="text" className="w-full p-2 border rounded-md focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Pengasuh</label>
                        <input type="text" className="w-full p-2 border rounded-md focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Hari</label>
                        <input type="text" className="w-full p-2 border rounded-md focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Kitab</label>
                        <input
                            type="file"
                            onChange={handleKitabFileChange}
                            className="w-full p-2 border rounded-md focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition-colors"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Detail Pengajian */}
            <Modal
                isOpen={isDetailModalOpen}
                onRequestClose={() => setIsDetailModalOpen(false)}
                contentLabel="Detail Pengajian"
                className="bg-white p-8 rounded-md shadow-md max-w-md m-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Detail Pengajian</h2>
                {selectedPengajian ? (
                    <>
                        <p className="mb-2"><strong>Nama:</strong> {selectedPengajian.nama}</p>
                        <p className="mb-2"><strong>Pengasuh:</strong> {selectedPengajian.pengasuh}</p>
                        <p className="mb-2"><strong>Hari:</strong> {selectedPengajian.hari}</p>
                        {selectedPengajian.kitab && (
                            <p className="mb-2">
                                <strong>Kitab:</strong>
                                <a
                                    href={selectedPengajian.kitabLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    {selectedPengajian.kitab}
                                </a>
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-center">Tidak ada data yang tersedia.</p>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        onClick={() => setIsDetailModalOpen(false)}
                    >
                        Tutup
                    </button>
                </div>
            </Modal>


            {/* Modal Edit Pengajian */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                contentLabel="Edit Pengajian"
                className="bg-white p-8 rounded-md shadow-md max-w-md m-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Edit Pengajian</h2>
                {selectedPengajian && (
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nama Pengajian</label>
                            <input
                                type="text"
                                defaultValue={selectedPengajian.nama}
                                className="w-full p-2 border rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pengasuh</label>
                            <input
                                type="text"
                                defaultValue={selectedPengajian.pengasuh}
                                className="w-full p-2 border rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Hari</label>
                            <input
                                type="text"
                                defaultValue={selectedPengajian.hari}
                                className="w-full p-2 border rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Kitab</label>
                            <input
                                type="file"
                                onChange={handleKitabFileChange}
                                className="w-full p-2 border rounded-md focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition-colors"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};