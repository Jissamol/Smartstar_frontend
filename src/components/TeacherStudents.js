import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaPlus, FaUser, FaEnvelope, FaGraduationCap, FaBuilding, FaEdit, FaUserPlus, FaTrash } from 'react-icons/fa';

const TeacherStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        roll_number: '',
        semester: '',
    });
    const [message, setMessage] = useState('');
    const [teacherDepartment, setTeacherDepartment] = useState('');

    // Group students by semester
    const studentsBySemester = students.reduce((acc, student) => {
        const semester = student.semester;
        if (!acc[semester]) {
            acc[semester] = [];
        }
        acc[semester].push(student);
        return acc;
    }, {});

    // Sort semesters in ascending order
    const sortedSemesters = Object.keys(studentsBySemester).sort((a, b) => a - b);

    useEffect(() => {
        const fetchTeacherDepartment = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/teacher/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTeacherDepartment(response.data.department);
                fetchStudents(response.data.department);
            } catch (err) {
                setError('Failed to load teacher profile. Please try again.');
                setLoading(false);
            }
        };

        fetchTeacherDepartment();
    }, []);

    const fetchStudents = async (department) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/students/department/${department}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStudents(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load students. Please try again.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/students/register/', {
                ...formData,
                department: teacherDepartment
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage('Student added successfully! Credentials have been sent to their email.');
            setFormData({
                username: '',
                email: '',
                roll_number: '',
                semester: '',
            });
            setShowAddForm(false);
            fetchStudents(teacherDepartment);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add student. Please try again.');
        }
    };

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setFormData({
            username: student.user.username,
            email: student.user.email,
            roll_number: student.roll_number,
            semester: student.semester,
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8000/api/students/${selectedStudent.id}/`, {
                user: {
                    username: formData.username,
                    email: formData.email,
                },
                roll_number: formData.roll_number,
                semester: formData.semester,
                department: teacherDepartment
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessage('Student details updated successfully!');
            setShowEditForm(false);
            setSelectedStudent(null);
            setFormData({
                username: '',
                email: '',
                roll_number: '',
                semester: '',
            });
            fetchStudents(teacherDepartment);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update student details. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingSpinnerStyle}></div>
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <Sidebar />
            <div style={mainContentStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>Students in {teacherDepartment}</h2>
                    <button 
                        onClick={() => setShowAddForm(true)} 
                        style={addButtonStyle}
                    >
                        <FaPlus style={{ marginRight: '8px' }} />
                        Add Student
                    </button>
                </div>

                {error && (
                    <div style={errorContainerStyle}>
                        <p style={errorTextStyle}>{error}</p>
                    </div>
                )}

                {message && (
                    <div style={messageContainerStyle}>
                        <p style={messageTextStyle}>{message}</p>
                    </div>
                )}

                {showAddForm && (
                    <div style={formContainerStyle}>
                        <h3 style={formTitleStyle}>Add New Student</h3>
                        <form onSubmit={handleAddSubmit} style={formStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Roll Number</label>
                                <input
                                    type="text"
                                    name="roll_number"
                                    value={formData.roll_number}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Semester</label>
                                <input
                                    type="number"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    max="8"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={buttonContainerStyle}>
                                <button type="submit" style={submitButtonStyle}>
                                    Add Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    style={cancelButtonStyle}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {showEditForm && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h3 style={formTitleStyle}>Edit Student Details</h3>
                            <form onSubmit={handleEditSubmit} style={formStyle}>
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Roll Number</label>
                                    <input
                                        type="text"
                                        name="roll_number"
                                        value={formData.roll_number}
                                        onChange={handleChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>Semester</label>
                                    <input
                                        type="number"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        max="8"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={buttonContainerStyle}>
                                    <button type="submit" style={submitButtonStyle}>
                                        Update Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditForm(false)}
                                        style={cancelButtonStyle}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {sortedSemesters.map(semester => (
                    <div key={semester} style={semesterContainerStyle}>
                        <h2 style={semesterTitleStyle}>Semester {semester}</h2>
                        <div style={studentsGridStyle}>
                            {studentsBySemester[semester].map((student) => (
                                <div key={student.id} style={studentCardStyle}>
                                    <div style={studentHeaderStyle}>
                                        <FaUser style={studentIconStyle} />
                                        <h3 style={studentNameStyle}>{student.user.username}</h3>
                                        <button
                                            onClick={() => handleEditClick(student)}
                                            style={editButtonStyle}
                                        >
                                            <FaEdit />
                                        </button>
                                    </div>
                                    <div style={studentInfoStyle}>
                                        <div style={infoItemStyle}>
                                            <FaEnvelope style={infoIconStyle} />
                                            <span>{student.user.email}</span>
                                        </div>
                                        <div style={infoItemStyle}>
                                            <FaGraduationCap style={infoIconStyle} />
                                            <span>Semester {student.semester}</span>
                                        </div>
                                        <div style={infoItemStyle}>
                                            <FaBuilding style={infoIconStyle} />
                                            <span>Roll No: {student.roll_number}</span>
                                        </div>
                                        <div style={infoItemStyle}>
                                            <FaBuilding style={infoIconStyle} />
                                            <span>Department: {student.department}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
};

const mainContentStyle = {
    flex: 1,
    padding: '2rem'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
};

const titleStyle = {
    fontSize: '1.8rem',
    color: '#1f2937',
    margin: 0
};

const addButtonStyle = {
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

const formContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const formTitleStyle = {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '1.5rem'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle = {
    fontSize: '0.9rem',
    color: '#4b5563',
    fontWeight: '500'
};

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
};

const submitButtonStyle = {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
};

const cancelButtonStyle = {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
};

const studentsContainerStyle = {
    marginTop: '2rem'
};

const studentsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
};

const studentCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const studentHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
};

const studentIconStyle = {
    width: '24px',
    height: '24px',
    color: '#3b82f6'
};

const studentNameStyle = {
    fontSize: '1.25rem',
    color: '#1f2937',
    margin: 0
};

const studentInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
};

const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4b5563'
};

const infoIconStyle = {
    width: '16px',
    height: '16px',
    color: '#6b7280'
};

const noStudentsStyle = {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem'
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
    padding: '1rem',
    backgroundColor: '#fee2e2',
    borderRadius: '6px',
    marginBottom: '1rem'
};

const errorTextStyle = {
    color: '#dc2626',
    fontSize: '0.9rem'
};

const messageContainerStyle = {
    padding: '1rem',
    backgroundColor: '#d1fae5',
    borderRadius: '6px',
    marginBottom: '1rem'
};

const messageTextStyle = {
    color: '#065f46',
    fontSize: '0.9rem'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const editButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
    ':hover': {
        backgroundColor: '#f3f4f6'
    }
};

const semesterContainerStyle = {
    marginBottom: '2rem'
};

const semesterTitleStyle = {
    fontSize: '1.5rem',
    color: '#1f2937',
    marginBottom: '1rem'
};

export default TeacherStudents; 