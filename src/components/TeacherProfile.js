import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import axios from 'axios';
import { 
    FaUser, FaEnvelope, FaGraduationCap, FaBriefcase, FaBook, FaBuilding, 
    FaPhone, FaEdit, FaArrowLeft
} from 'react-icons/fa';

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/teacher/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setTeacherData(response.data);
                if (response.data.profile_picture) {
                    setProfileImage(`http://localhost:8000${response.data.profile_picture}`);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile data. Please try again.');
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    if (loading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingSpinnerStyle}></div>
                <p>Loading profile data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={errorContainerStyle}>
                <p style={errorTextStyle}>{error}</p>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div style={infoItemStyle}>
            <Icon style={infoIconStyle} />
            <div>
                <p style={infoLabelStyle}>{label}</p>
                <p style={infoValueStyle}>{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            <div style={profileCardStyle}>
                {/* Header with Back Button */}
                <div style={headerStyle}>
                    <button 
                        onClick={() => navigate('/teacher/dashboard')} 
                        style={backButtonStyle}
                    >
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Dashboard
                    </button>
                </div>

                {/* Profile Content */}
                <div style={contentContainerStyle}>
                    {/* Left Column - Profile Picture and Basic Info */}
                    <div style={leftColumnStyle}>
                        <div style={profileImageContainerStyle}>
                            {profileImage ? (
                                <img 
                                    src={profileImage} 
                                    alt="Profile" 
                                    style={profileImageStyle}
                                />
                            ) : (
                                <div style={defaultProfileImageStyle}>
                                    <FaUser style={defaultProfileIconStyle} />
                                </div>
                            )}
                        </div>
                        <h1 style={nameStyle}>
                            {teacherData?.first_name} {teacherData?.last_name}
                        </h1>
                        <button 
                            onClick={() => navigate('/teacher/profile/edit')} 
                            style={editButtonStyle}
                        >
                            <FaEdit style={{ marginRight: '8px' }} />
                            Edit Profile
                        </button>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div style={rightColumnStyle}>
                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Personal Information</h2>
                            <div style={infoGridStyle}>
                                <InfoItem icon={FaEnvelope} label="Email" value={teacherData?.email} />
                                <InfoItem icon={FaPhone} label="Phone" value={teacherData?.contact_number} />
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h2 style={sectionTitleStyle}>Professional Information</h2>
                            <div style={infoGridStyle}>
                                <InfoItem icon={FaGraduationCap} label="Qualification" value={teacherData?.qualification} />
                                <InfoItem icon={FaBook} label="Subject" value={teacherData?.subject} />
                                <InfoItem icon={FaBriefcase} label="Experience" value={`${teacherData?.experience} years`} />
                                <InfoItem icon={FaBuilding} label="Department" value={teacherData?.department} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
};

const profileCardStyle = {
    width: '100%',
    maxWidth: '1200px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
};

const headerStyle = {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-start'
};

const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500'
};

const contentContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    padding: '2rem',
    gap: '2rem'
};

const leftColumnStyle = {
    flex: '0 0 300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem'
};

const rightColumnStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
};

const profileImageContainerStyle = {
    marginBottom: '1.5rem'
};

const profileImageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const defaultProfileImageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const defaultProfileIconStyle = {
    width: '80px',
    height: '80px',
    color: '#9ca3af'
};

const nameStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center'
};

const editButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500'
};

const sectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
};

const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem'
};

const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
};

const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease'
};

const infoIconStyle = {
    width: '20px',
    height: '20px',
    color: '#3b82f6'
};

const infoLabelStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.25rem'
};

const infoValueStyle = {
    fontSize: '1rem',
    color: '#1f2937',
    fontWeight: '500'
};

const loadingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
};

const loadingSpinnerStyle = {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f4f6',
    borderTop: '5px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
};

const errorContainerStyle = {
    padding: '1.5rem',
    backgroundColor: '#fee2e2',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '2rem auto',
    maxWidth: '600px'
};

const errorTextStyle = {
    color: '#dc2626',
    fontSize: '1rem',
    fontWeight: '500'
};

export default TeacherProfile;
