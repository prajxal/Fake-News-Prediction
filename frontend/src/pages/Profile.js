import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    // Initialize from local storage, fallback to empty object
    const initialUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [username, setUsername] = useState(initialUser.username || '');
    const [email] = useState(initialUser.email || ''); // Read-only
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await userAPI.updateUserProfile(username);

            // Update local storage with new user data
            const updatedUser = { ...initialUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Important: Persist new username

            setMessage('Profile updated successfully!');
            // Optional: Redirect or stay on page
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    return (
        <div>
            <div className="navbar">
                <div className="navbar-content">
                    <h1>Fake News Detection Platform</h1>
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2>My Profile</h2>

                    {message && <div className="success" style={{ marginBottom: '15px' }}>{message}</div>}
                    {error && <div className="error" style={{ marginBottom: '15px' }}>{error}</div>}

                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Email (Read-only)</label>
                            <input
                                type="text"
                                value={email}
                                disabled
                                style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                                required
                                minLength={3}
                                maxLength={30}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
