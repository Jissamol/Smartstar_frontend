import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import "./TeachersLogin.css";

const TeachersLogin = () => {
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
        password: formData.password,
        role: 'teacher'
      });

      if (response.data.tokens) {
        localStorage.setItem('token', response.data.tokens.access);
        localStorage.setItem('userRole', 'teacher');
        
        // Check if the user is a teacher and is approved
        try {
          const profileResponse = await axios.get('http://localhost:8000/api/teacher/profile/', {
            headers: {
              'Authorization': `Bearer ${response.data.tokens.access}`
            }
          });
          
          // If we get here, the teacher is approved
          navigate('/teacher/dashboard');
        } catch (profileError) {
          if (profileError.response?.status === 403) {
            setError("Your account is pending approval. Please wait for admin approval.");
          } else {
            setError("Error accessing teacher profile. Please try again.");
          }
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="teachers-login-container">
      <div className="teachers-login-box">
        <h2 className="teachers-login-title">Teacher Login</h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="teachers-login-input-group">
            <label className="teachers-login-label">Email</label>
            <div className="teachers-login-input-container">
              <FaUser className="teachers-login-icon" />
              <input
                type="email"
                name="email"
                className="teachers-login-input"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="teachers-login-input-group">
            <label className="teachers-login-label">Password</label>
            <div className="teachers-login-input-container">
              <FaLock className="teachers-login-icon" />
              <input
                type="password"
                name="password"
                className="teachers-login-input"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="teachers-login-button">
            Login
          </button>
          <div className="teachers-login-register-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/teachersreg")} className="teachers-login-link">
              Register here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeachersLogin;
