import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaUser, FaEnvelope, FaGraduationCap, FaBriefcase, FaBook, FaBuilding, 
    FaPhone 
} from 'react-icons/fa';

const TeacherProfile = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
                <p>{error}</p>
            </div>
        );
    }

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg shadow-sm">
            <Icon className="w-5 h-5 text-blue-600" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-gray-800 font-medium">{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full p-6 flex flex-col md:flex-row items-center md:items-start">
                {/* Profile Picture */}
                <div className="flex flex-col items-center md:items-start md:w-1/3">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover" />
                    ) : (
                        <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                            <FaUser className="w-16 h-16 text-gray-400" />
                        </div>
                    )}
                    <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center md:text-left">
                        {teacherData?.first_name} {teacherData?.last_name}
                    </h1>
                </div>

                {/* Profile Details */}
                <div className="flex-1 md:ml-8 mt-6 md:mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4" style={{ marginLeft: 650, marginTop: -352 }}>
                            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                            <InfoItem icon={FaEnvelope} label="Email" value={teacherData?.email} />
                            <InfoItem icon={FaPhone} label="Phone" value={teacherData?.contact_number} />
                        </div>
                        <div className="space-y-4" style={{ marginLeft: 1080, marginTop: -285 }}>
                            <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                            <InfoItem icon={FaGraduationCap} label="Qualification" value={teacherData?.qualification} />
                            <InfoItem icon={FaBook} label="Subject" value={teacherData?.subject} />
                            <InfoItem icon={FaBriefcase} label="Experience" value={`${teacherData?.experience} years`} />
                            <InfoItem icon={FaBuilding} label="Department" value={teacherData?.department} />
                        </div>
                    </div>

                    {/* Back to Dashboard Button */}
                    <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/teacher/dashboard')} 
                        className="px-6 py-2 bg-blue-600 text-black font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Back to Dashboard
                    </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
