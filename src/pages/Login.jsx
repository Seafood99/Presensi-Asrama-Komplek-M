import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Cookies from 'universal-cookie';

Modal.setAppElement('#root');

const Login = () => {
    const cookies = new Cookies();
    const [nis, setNis] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [forgotNis, setForgotNis] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://strong-aphid-joint.ngrok-free.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nis, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login gagal. Silakan periksa NIS dan password.');
            }

            const data = await response.json();
            console.log('Response dari server:', data);

            // Pastikan struktur data yang diterima sesuai
            if (data.token) {
                // Simpan nama, role, dan nis pengguna ke localStorage
                cookies.set('token', data.token, { path: '/' });
                // Arahkan ke dashboard setelah login berhasil
                navigate('/dashboard');
            } else {
                throw new Error('Login gagal. Data pengguna tidak lengkap.');
            }
        } catch (error) {
            console.error('Error saat login:', error);
            setError(error.message);
        }
    };

    const handleForgotPassword = () => {
        setShowModal(true);
    };

    const handleForgotSubmit = () => {
        // Logika untuk reset password dapat ditambahkan di sini, misalnya mengirim email atau memberikan instruksi lebih lanjut
        alert(`Instruksi reset password telah dikirim ke NIS: ${forgotNis}`);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900">
            <div className="bg-white p-10 rounded-md shadow-md w-full max-w-sm">
                {/* Logo Pesantren */}
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="Logo pesantren" className="w-32 h-auto" />
                </div>

                {/* Form login */}
                <form onSubmit={handleLogin}>
                    <div className="flex items-center border-b border-gray-400 py-2 mb-4">
                        <span className="mr-2 text-gray-500">
                            <i className="fas fa-user"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="NIS"
                            value={nis}
                            onChange={(e) => setNis(e.target.value)}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                            required
                        />
                    </div>

                    <div className="flex items-center border-b border-gray-400 py-2 mb-6">
                        <span className="mr-2 text-gray-500">
                            <i className="fas fa-key"></i>
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                            required
                        />
                        <span className="ml-2 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                        </span>
                    </div>

                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-teal-900 hover:underline"
                        >
                            Lupa Password?
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="relative group overflow-hidden px-6 py-3 font-bold text-white bg-teal-900 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-teal-800 hover:shadow-2xl active:scale-95"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                            <span className="relative z-10">Login</span>
                            <span
                                className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-in-out group-hover:left-full group-hover:w-full"
                            ></span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal Forgot Password */}
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Lupa Password"
                className="bg-white p-8 rounded-md shadow-md w-full max-w-sm m-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Lupa Password</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Masukkan NIS Anda"
                        value={forgotNis}
                        onChange={(e) => setForgotNis(e.target.value)}
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
                        onClick={handleForgotSubmit}
                        className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-800"
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Login;
