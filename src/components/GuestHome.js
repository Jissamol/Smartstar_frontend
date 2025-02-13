import React from "react";
import { Link } from "react-router-dom";
import "./GuestHome.css"; // Import styles

const GuestHome = () => {
  return (
    <div className="guest-home">
      <header className="guest-header">
        <h1>Welcome to SmartStar Academic Performance Analysis</h1>
        <p>Track and improve your academic performance with ease.</p>
      </header>

      <div className="login-boxes">
        <Link to="/" className="box college">
          <h2>College</h2>
          <p>Login as Admin</p>
        </Link>
        <Link to="/" className="box teachers">
          <h2>Teachers</h2>
          <p>Login as Teacher</p>
        </Link>
        <Link to="/" className="box students">
          <h2>Students</h2>
          <p>Login as Student</p>
        </Link>
      </div>
    </div>
  );
};

export default GuestHome;
