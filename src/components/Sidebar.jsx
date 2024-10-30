import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

const Sidebar = ({ user }) => {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [newProfile, setNewProfile] = useState({ oldPassword: '', newPassword: '', profilePicture: null });

    const handleEditProfile = () => {
        setIsEditProfileOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditProfileOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePicture') {
            setNewProfile((prevState) => ({ ...prevState, profilePicture: files[0] }));
        } else {
            setNewProfile((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleSaveProfile = () => {
        // Simpan perubahan profil, seperti mengunggah foto profil dan mengganti password
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda akan menyimpan perubahan profil ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, simpan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('New Profile Data:', newProfile);
                // Lakukan panggilan API untuk menyimpan perubahan profil di backend
                Swal.fire('Tersimpan!', 'Profil telah berhasil disimpan.', 'success');
                handleCloseModal();
            }
        });
    };

    return (
        <div className="w-1/4 bg-teal-800 p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Komplek M Al-Busyro</h1>
            </div>
            <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
                <h2 className="text-lg text-white mt-4 font-semibold">
                    {typeof user.name === 'string' ? user.name : 'User'}
                </h2>
                <span className="text-sm text-white">
                    {typeof user.role === 'string' ? user.role : 'Role Tidak Diketahui'}
                </span>

                <div className="mt-4">
                    <button
                        onClick={handleEditProfile}
                        className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                    >
                        Edit Profil
                    </button>
                </div>
            </div>
            <nav>
                <ul>
                    <li className="mb-2">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded ${isActive ? 'bg-teal-700' : 'hover:bg-teal-600'} text-white`
                            }
                        >
                            <img src="src/assets/home.svg" alt="Logo Home" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/panduan"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded ${isActive ? 'bg-teal-700' : 'hover:bg-teal-600'} text-white`
                            }
                        >
                            <img src="src/assets/book-bookmark-fill.svg" alt="Logo Panduan" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span>Panduan Website</span>
                        </NavLink>
                    </li>
                    <li className="mb-2">
                        <NavLink
                            to="/presensi"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded ${isActive ? 'bg-teal-700' : 'hover:bg-teal-600'} text-white`
                            }
                        >
                            <img src="src/assets/checklist.svg" alt="Logo Presensi" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span>Presensi</span>
                        </NavLink>
                    </li>
                    {user.role === 'admin' && (
                        <li className="mb-2">
                            <NavLink
                                to="/santri"
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded ${isActive ? 'bg-teal-700' : 'hover:bg-teal-600'} text-white`
                                }
                            >
                                <img src="src/assets/user.svg" alt="Logo Santri" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span>Santri</span>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            {/* Modal untuk Edit Profil */}
            <Modal
                isOpen={isEditProfileOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Edit Profil"
                className="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                style={{
                    overlay: {
                        zIndex: 1000
                    },
                    content: {
                        zIndex: 1001
                    }
                }}
            >
                <h2 className="text-2xl font-bold mb-4">Edit Profil</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
                    <input
                        type="file"
                        name="profilePicture"
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password Lama</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={newProfile.oldPassword}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={newProfile.newPassword}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded w-full"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition duration-200"
                    >
                        Simpan
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                    >
                        Batal
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Sidebar;
