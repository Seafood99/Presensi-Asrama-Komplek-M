import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [nis, setNis] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('https://presensi-asrama-komplek-m-production.up.railway.app/api/santri', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nis, password })
        });

        const data = await response.json();

        // if (response.ok) {
        //     // Simpan nama dan role pengguna ke localStorage
        //     localStorage.setItem('user', JSON.stringify({ name: data.user, role: data.role }));

        //     // Arahkan ke dashboard setelah login berhasil
        //     navigate('/dashboard');
        // } else {
        //     setError(data.message);
        // }

        if (response.ok) {
            // Simpan nama, role, dan nis pengguna ke localStorage
            localStorage.setItem('user', JSON.stringify({ name: data.user, role: data.role, nis: nis }));

            // Arahkan ke dashboard setelah login berhasil
            navigate('/dashboard');
        } else {
            setError(data.message);
        }

    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-900">
            <div className="bg-white p-10 rounded-md shadow-md w-full max-w-sm">
                {/* Logo Pesantren */}
                <div className="flex justify-center mb-6">
                    <img src="src\assets\logo.png" alt="Logo pesantren" className="w-32 h-auto" />
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
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

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
        </div>
    );
};

export default Login;