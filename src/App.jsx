import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Presensi from './pages/PresensiPage'; // Import halaman presensi umum
import SantriPage from './pages/SantriPage'; // Import halaman santri
import PanduanPage from './pages/PanduanWebsite';
import Pengajian from './pages/Pengajian'; // Import halaman pengajian

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presensi" element={<Presensi />} /> {/* Route untuk halaman presensi */}
        <Route path="/santri" element={<SantriPage />} /> {/* Route untuk halaman santri */}
        <Route path="/panduan" element={<PanduanPage />} />
        <Route path="/pengajian" element={<Pengajian />} />
      </Routes>
    </Router>
  );
}

export default App;
