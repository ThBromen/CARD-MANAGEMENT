import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import CardRequest from './pages/CardRequest';
import Dashboard from './pages/Dashboard';
import VerifyCard from './pages/VerifyCard';
import Profile from './pages/Profile';
import LogInPage from './pages/LogInPage'; 
import SignUpPage from './pages/SignUpPage'; 
import StudentRequestForm from './pages/StudentRequestForm'; 

import './App.css'; 
import { motion } from 'framer-motion'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Home Page */}
        <Route
          path="/"
          element={
            <div className="relative min-h-screen w-full overflow-hidden text-white">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
              >
                <source src="/bg-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 bg-black/30 backdrop-blur-md text-center">
                <motion.h1
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-xl"
                >
                  Student <span className="text-blue-400">ID Portal</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-lg md:text-xl max-w-xl mb-12 text-gray-200"
                >
                  Manage, verify, and download secure student ID cards on the blockchain.
                </motion.p>
                <motion.div
                  className="flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <Link
                    to="/student"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition duration-300 backdrop-blur-sm"
                  >
                    🎓 Student Request
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg transition duration-300 backdrop-blur-sm"
                  >
                    🔐 Admin Login
                  </Link>
                  <Link
                    to="/verify"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg transition duration-300 backdrop-blur-sm"
                  >
                    🔍 Verify Card
                  </Link>
                </motion.div>
              </div>
            </div>
          }
        />

        {/* 🛣️ Routes */}
        <Route path="/student" element={<StudentRequestForm />} />
        <Route path="/card-request" element={<CardRequest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<VerifyCard />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<Profile />} />

        {/* ❓ Fallback Route (Optional) */}
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
