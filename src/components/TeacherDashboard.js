import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/teacherslog');
        }
        setUserName(localStorage.getItem('userName') || 'Welcome Back!');
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            navigate('/teacherslog');
        }
    };

    const handleProfileClick = () => {
        navigate('/teacher/profile');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const NavItem = ({ icon: Icon, text, onClick, isActive }) => (
        <button
            onClick={() => { onClick(); closeSidebar(); }}
            className="flex items-center px-6 py-3 w-full transition duration-200 text-gray-300 hover:bg-blue-700/50 rounded-lg mb-1"
        >
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{text}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:static w-72 bg-gray-900 h-full transition-transform duration-200 z-40`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                <FaUserCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white text-lg font-semibold">Teacher Portal</h2>
                                <p className="text-gray-400 text-sm">{userName}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <NavItem 
                            icon={FaUserCircle} 
                            text="View Profile" 
                            onClick={handleProfileClick}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <NavItem 
                            icon={FaSignOutAlt} 
                            text="Logout" 
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* <div className="flex items-center">
                            <button className="lg:hidden text-gray-600 mr-4" onClick={toggleSidebar}>
                                {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Teacher Dashboard</h1>
                        </div> */}
                        <div className="text-gray-600">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                {/* <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to SmartStar Teacher Portal</h2>
                        <p className="text-gray-600 mb-8">Click on "View Profile" to manage your profile information.</p>
                        <button
                            onClick={handleProfileClick}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaUserCircle className="w-5 h-5 mr-2" />
                            View Profile
                        </button>
                    </div>
                </main> */}
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
                    onClick={closeSidebar}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;