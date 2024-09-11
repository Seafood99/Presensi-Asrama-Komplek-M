import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Arahkan root path (/) ke halaman login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Route halaman dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route lainnya bisa ditambahkan di sini */}
      </Routes>
    </Router>
  );
}

export default App;