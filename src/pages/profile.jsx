import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        // Optional: decode token to get user ID (if it's a JWT and includes it), else fetch from /me route
        const response = await fetch(`https://student-card-api.onrender.com/api/v1/user/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch user');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src={user.avatar || 'https://via.placeholder.com/100'}
          alt="Avatar"
          style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 16 }}
        />
        <h2>{user.name}</h2>
        <p style={{ color: '#888' }}>{user.email}</p>
      </div>
      <div style={{ marginTop: 24 }}>
        <p><strong>Student ID:</strong> {user.studentId || 'N/A'}</p>
        <p><strong>Major:</strong> {user.major || 'N/A'}</p>
      </div>
    </div>
  );
};

export default Profile;
