import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function SignUpPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        school: '',
        yearOfStudy: '',
        department: '',
        photo: '',
        password: '',
        confirmPassword: '',
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo' && files.length) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Only image files are allowed');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be under 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.registrationNumber ||
            !formData.school ||
            !formData.yearOfStudy ||
            !formData.department ||
            !formData.photo ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error('Please fill all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('https://student-card-api.onrender.com/api/v1/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    registrationNumber: formData.registrationNumber,
                    school: formData.school,
                    yearOfStudy: formData.yearOfStudy,
                    department: formData.department,
                    photo: formData.photo,
                    password: formData.password,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    registrationNumber: '',
                    school: '',
                    yearOfStudy: '',
                    department: '',
                    photo: '',
                    password: '',
                    confirmPassword: '',
                });
                setPhotoPreview('');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
        setLoading(false);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            registrationNumber: '',
            school: '',
            yearOfStudy: '',
            department: '',
            photo: '',
            password: '',
            confirmPassword: '',
        });
        setPhotoPreview('');
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow mt-10">
            <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Registration Number"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    placeholder="School"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    type="number"
                    placeholder="Year of Study"
                    min="1"
                    max="6"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Department"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                {photoPreview && (
                    <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                    />
                )}
                <div className="flex justify-between flex-wrap gap-2 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                        disabled={loading}
                    >
                        Back to Home
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex-1"
                        disabled={loading}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Sign Up'}
                    </button>
                </div>
            </form>
            <ToastContainer position="top-center" />
        </div>
    );
}

export default SignUpPage;
