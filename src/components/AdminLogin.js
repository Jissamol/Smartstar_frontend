import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                email,
                password
            });

            if (response.data.success) {
                const { tokens, user_info } = response.data;
                
                // Check if user is admin/superuser
                if (!user_info.is_superuser && user_info.role !== 'admin') {
                    setError('Access denied. Only administrators can login here.');
                    return;
                }

                // Store tokens
                localStorage.setItem('access', tokens.access);
                localStorage.setItem('refresh', tokens.refresh);
                localStorage.setItem('user_role', user_info.role);
                localStorage.setItem('user_email', user_info.email);

                // Redirect to admin dashboard
                navigate('/admin-dashboard');
            } else {
                setError(response.data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h1>SmartStar Admin</h1>
                    <p>Login to access the admin dashboard</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span className="error-icon">⚠</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>SmartStar Education Management System</p>
                    <small>&copy; {new Date().getFullYear()} SmartStar. All rights reserved.</small>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
