import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogInPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('https://student-card-api.onrender.com/api/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await login(form.email, form.password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/AdminLogin'); 
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: error.message }));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} noValidate>
        {errors.general && <div style={{ color: 'red', marginBottom: 16 }}>{errors.general}</div>}

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email:</label><br />
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.email && <div style={{ color: 'red', fontSize: 12 }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password:</label><br />
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.password && <div style={{ color: 'red', fontSize: 12 }}>{errors.password}</div>}
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>Log In</button>
      </form>
    </div>
  );
}

export default LogInPage;
