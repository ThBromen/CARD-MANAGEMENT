import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '../services/api';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './Dashboard';

function AdminLogin() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (authUtils.isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    authUtils.logout();
    setAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // If not authenticated, redirect to login page
  if (!authenticated) {
    navigate('/login');
    return null;
  }

  if (authenticated) {
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <ToastContainer position="top-center" />
      </>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default AdminLogin;
