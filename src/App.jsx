import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Presensi from './pages/PresensiPage'; // Import halaman presensi umum
import SantriPage from './pages/SantriPage'; // Import halaman santri
import PageTitle from './components/PageTitle'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={
          <>
            <PageTitle title="Login" />
            <Login />
          </>
          } />
        <Route path="/dashboard" element={
          <>
            <PageTitle title="Dashboard" />
            <Dashboard />
          </>
          } />
        <Route path="/presensi" element={
          <>
            <PageTitle title="Presensi" />
            <Presensi />
          </>
          } /> {/* Route untuk halaman presensi */}
        <Route path="/santri" element={
          <>
            <PageTitle title="Santri" />
            <SantriPage />
          </>
          } /> {/* Route untuk halaman santri */}
      </Routes>
    </Router>
  );
}

export default App;
