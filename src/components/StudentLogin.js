import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./StudentLogin.css"; // Import the CSS file

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Login Details:", { username, password });

    // TODO: Replace with actual API call
    if (username === "student" && password === "student123") {
      alert("Login Successful!");
      // Redirect to student dashboard
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-box">
        <h2 className="student-login-title">Student Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="student-login-input-group">
            <label className="student-login-label">Username</label>
            <div className="student-login-input-container">
              <FaUser className="student-login-icon" />
              <input
                type="text"
                className="student-login-input"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                className="student-login-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
