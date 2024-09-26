import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ user }) => {
    return (
        <div className="w-1/4 bg-teal-800 p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Komplek M Al-Busyro</h1>
            </div>
            <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div>
                <h2 className="text-lg text-white mt-4 font-semibold">{user.name}</h2>
                <span className="text-sm text-white">{user.role}</span>
                <div className="mt-4">
                    <button className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Lihat Profil</button>
                    <button className="bg-blue-500 text-white px-4 py-1 rounded">Foto Profil</button>
                </div>
            </div>
            <nav>
                <ul>
                    <li className="mb-2">
                        <Link to="/dashboard" className="flex items-center p-2 hover:bg-teal-600 rounded">
                            <img src="src/assets/home.svg" alt="Logo Home" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span className="text-white">Dashboard</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/panduan" className="flex items-center p-2 hover:bg-teal-600 rounded">
                            <img src="src/assets/book-bookmark-fill.svg" alt="Logo Panduan" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span className="text-white">Panduan Website</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/presensi" className="flex items-center p-2 hover:bg-teal-600 rounded">
                            <img src="src/assets/checklist.svg" alt="Logo Presensi" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                            <span className="text-white">Presensi</span>
                        </Link>
                    </li>
                    {user.role === 'admin' && (
                        <li className="mb-2">
                            <Link to="/santri" className="flex items-center p-2 hover:bg-teal-600 rounded">
                                <img src="src/assets/user.svg" alt="Logo Santri" className="w-6 h-6 mr-2" style={{ filter: 'invert(1)' }} />
                                <span className="text-white">Santri</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
