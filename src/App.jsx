import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Presensi from './pages/PresensiPage'; // Import halaman presensi umum
import SantriPage from './pages/SantriPage'; // Import halaman santri

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presensi" element={<Presensi />} /> {/* Route untuk halaman presensi */}
        <Route path="/santri" element={<SantriPage />} /> {/* Route untuk halaman santri */}
      </Routes>
    </Router>
  );
}

export default App;
