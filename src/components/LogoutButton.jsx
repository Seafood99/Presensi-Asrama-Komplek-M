import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Tampilkan konfirmasi menggunakan SweetAlert2
    Swal.fire({
      title: 'Apakah Anda yakin ingin logout?',
      text: "Anda harus login lagi untuk mengakses aplikasi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna mengonfirmasi logout, hapus data autentikasi
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect ke halaman login
        navigate('/login');

        // Tampilkan pesan berhasil logout
        Swal.fire(
          'Logout!',
          'Anda telah berhasil logout.',
          'success'
        );
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
