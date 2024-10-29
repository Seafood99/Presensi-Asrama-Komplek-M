import React from 'react';
import { useNavigate } from 'react-router-dom';

const PanduanPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-800 to-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Panduan Website Komplek M Al-Busyro</h1>

            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-teal-800">Akses Website di Perangkat Mobile</h2>
                <ol className="list-decimal list-inside text-lg leading-relaxed">
                    <li>Buka aplikasi browser (seperti Chrome atau Safari) di ponsel Anda.</li>
                    <li>Masukkan alamat website pada kolom pencarian, lalu tekan enter.</li>
                    <li>Gunakan menu navigasi yang biasanya berada di bagian atas atau bawah layar. Anda dapat mengetuk ikon menu untuk membuka halaman seperti Dashboard, Presensi, Panduan, atau Data Santri.</li>
                    <li>Website ini dirancang responsif, sehingga kontennya akan menyesuaikan ukuran layar ponsel Anda.</li>
                    <li>Pastikan Anda sudah login menggunakan NIS dan password yang telah diberikan oleh admin.</li>
                </ol>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-teal-800">Akses Website di Perangkat Desktop</h2>
                <ol className="list-decimal list-inside text-lg leading-relaxed">
                    <li>Buka browser seperti Chrome, Firefox, atau Microsoft Edge.</li>
                    <li>Masukkan alamat website di bar pencarian dan tekan enter.</li>
                    <li>Menu navigasi berada di bagian kiri halaman untuk memudahkan akses ke berbagai fitur.</li>
                    <li>Tampilan desktop memberikan informasi lebih lengkap dibandingkan di perangkat mobile.</li>
                </ol>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-teal-800">Panduan Role Pengguna</h2>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-teal-700">1. Super Admin</h3>
                    <p className="text-lg leading-relaxed">Super Admin memiliki kendali penuh atas semua fitur di website ini:</p>
                    <ul className="list-disc list-inside ml-6 text-lg leading-relaxed">
                        <li>Mengelola pengguna (menambah, mengedit, atau menghapus data santri).</li>
                        <li>Mengelola presensi santri dan menambahkan data presensi manual.</li>
                        <li>Dapat mengakses seluruh halaman.</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-teal-700">2. Admin</h3>
                    <p className="text-lg leading-relaxed">Admin memiliki kemampuan yang hampir sama dengan Super Admin:</p>
                    <ul className="list-disc list-inside ml-6 text-lg leading-relaxed">
                        <li>Mengelola data santri.</li>
                        <li>Mengelola presensi dan meninjau rekap presensi.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-teal-700">3. User (Santri)</h3>
                    <p className="text-lg leading-relaxed">Santri hanya dapat mengakses informasi terkait diri mereka sendiri:</p>
                    <ul className="list-disc list-inside ml-6 text-lg leading-relaxed">
                        <li>Melihat status kehadiran.</li>
                        <li>Melaporkan kesalahan data presensi.</li>
                    </ul>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-teal-800">Tips Menggunakan Website</h2>
                <ul className="list-disc list-inside ml-6 text-lg leading-relaxed">
                    <li>Pastikan koneksi internet stabil untuk pengalaman terbaik.</li>
                    <li>Jangan bagikan password Anda ke orang lain untuk menjaga keamanan akun.</li>
                    <li>Selalu logout setelah selesai mengakses website jika menggunakan perangkat bersama.</li>
                </ul>
            </section>

            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition duration-300"
                >
                    Kembali
                </button>
            </div>
        </div>
    );
};

export default PanduanPage;

