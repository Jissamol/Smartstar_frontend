import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import "./StudentLogin.css"; // Import the CSS file

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.tokens) {
        localStorage.setItem('token', response.data.tokens.access);
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
        localStorage.setItem('userRole', response.data.user_info.role);
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-box">
        <h2 className="student-login-title">Student Login</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/* Email Field */}
          <div className="student-login-input-group">
            <label className="student-login-label">Email</label>
            <div className="student-login-input-container">
              <FaUser className="student-login-icon" />
              <input
                type="email"
                name="email"
                className="student-login-input"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="student-login-input-group">
            <label className="student-login-label">Password</label>
            <div className="student-login-input-container">
              <FaLock className="student-login-icon" />
              <input
                type="password"
                name="password"
                className="student-login-input"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="student-login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
