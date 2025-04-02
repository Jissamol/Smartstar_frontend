import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <ul>
                <li><Link to="/teacher/dashboard">Dashboard</Link></li>
                <li><Link to="/teacher/students">Students</Link></li>
                <li><Link to="#">Classes</Link></li>
                <li><Link to="#">Reports</Link></li>
                <li><Link to="/teacher/profile">View Profile</Link></li>
            </ul>
        </nav>
    );
};

export default Sidebar; 