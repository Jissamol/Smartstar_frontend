import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaCalendarAlt, FaClock } from 'react-icons/fa';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentName, setStudentName] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/studentslog');
        } else {
            // Fetch student profile data
            fetchStudentProfile();
        }
    }, [navigate]);

    const fetchStudentProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/student/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStudentName(data.user.username || 'Student');
            setDepartment(data.department || 'Department');
            setSemester(data.semester || 'Semester');
        } catch (error) {
            console.error('Error fetching student profile:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/studentslog');
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div style={statCardStyle}>
            <div style={{ ...statIconStyle, backgroundColor: color }}>
                <Icon size={24} color="white" />
            </div>
            <div style={statInfoStyle}>
                <h3 style={statTitleStyle}>{title}</h3>
                <p style={statValueStyle}>{value}</p>
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            {/* Main Content Area */}
            <div style={mainContentStyle}>
                {/* Header */}
                <div style={headerStyle}>
                    <div style={headerLeftStyle}>
                        <h1 style={titleStyle}>Welcome, {studentName}</h1>
                        <p style={subtitleStyle}>{department} - Semester {semester}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={logoutButtonStyle}
                    >
                        <FaSignOutAlt style={{ marginRight: '8px' }} />
                        Logout
                    </button>
                </div>

                {/* Dashboard Content */}
                <main style={contentStyle}>
                    {/* Stats Grid */}
                    <div style={statsGridStyle}>
                        <StatCard 
                            icon={FaBook}
                            title="Current Subjects"
                            value="5"
                            color="#4f46e5"
                        />
                        <StatCard 
                            icon={FaCalendarAlt}
                            title="Classes Today"
                            value="3"
                            color="#059669"
                        />
                        <StatCard 
                            icon={FaClock}
                            title="Attendance"
                            value="85%"
                            color="#db2777"
                        />
                    </div>

                    {/* Recent Activity Section */}
                    <div style={recentActivityStyle}>
                        <h2 style={sectionTitleStyle}>Recent Activity</h2>
                        <div style={activityListStyle}>
                            <div style={activityItemStyle}>
                                <div style={activityDotStyle}></div>
                                <p>Mathematics class at 10:00 AM</p>
                                <span style={activityTimeStyle}>Today</span>
                            </div>
                            <div style={activityItemStyle}>
                                <div style={activityDotStyle}></div>
                                <p>Physics assignment submitted</p>
                                <span style={activityTimeStyle}>Yesterday</span>
                            </div>
                            <div style={activityItemStyle}>
                                <div style={activityDotStyle}></div>
                                <p>Chemistry lab scheduled</p>
                                <span style={activityTimeStyle}>2 days ago</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6'
};

const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const headerLeftStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const titleStyle = {
    fontSize: '1.8rem',
    color: '#1e293b',
    margin: 0,
    fontWeight: '600'
};

const subtitleStyle = {
    color: '#64748b',
    marginTop: '0.25rem',
    fontSize: '1rem'
};

const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': {
        backgroundColor: '#dc2626',
        transform: 'translateY(-1px)'
    }
};

const contentStyle = {
    padding: '2rem',
    flex: 1
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
};

const statCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    ':hover': {
        transform: 'translateY(-4px)'
    }
};

const statIconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem'
};

const statInfoStyle = {
    flex: 1
};

const statTitleStyle = {
    color: '#64748b',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
    fontWeight: '500'
};

const statValueStyle = {
    color: '#1e293b',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
};

const recentActivityStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
};

const sectionTitleStyle = {
    fontSize: '1.25rem',
    color: '#1e293b',
    marginBottom: '1.5rem',
    fontWeight: '600'
};

const activityListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const activityItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    position: 'relative'
};

const activityDotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#4f46e5',
    borderRadius: '50%',
    marginRight: '1rem'
};

const activityTimeStyle = {
    color: '#94a3b8',
    fontSize: '0.875rem',
    marginLeft: 'auto'
};

export default StudentDashboard; 