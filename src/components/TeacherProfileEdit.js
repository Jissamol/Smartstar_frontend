import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from './Sidebar';
const TeacherProfileEdit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        subject: "",
        qualification: "",
        experience: "",
        contact_number: "",
        department: "",
        profile_picture: null
    });
    
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/teacher/profile/", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.data) {
                    setFormData({
                        username: response.data.username || "",
                        email: response.data.email || "",
                        subject: response.data.subject || "",
                        qualification: response.data.qualification || "",
                        experience: response.data.experience || "",
                        contact_number: response.data.contact_number || "",
                        department: response.data.department || "",
                        profile_picture: response.data.profile_picture || null
                    });
                    
                if (response.data.profile_picture) {
                        setPreviewUrl(`http://127.0.0.1:8000${response.data.profile_picture}`);
                }
                }
            } catch (error) {
                console.error("Error fetching profile details:", error);
                setMessage("Failed to load profile data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === "profile_picture") {
            const file = e.target.files[0];
            setFormData({ ...formData, profile_picture: file });
            if (file) {
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrors({});

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.put("http://127.0.0.1:8000/api/teacher/profile/", formDataToSend, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data) {
                setFormData({
                    username: response.data.username || "",
                    email: response.data.email || "",
                    subject: response.data.subject || "",
                    qualification: response.data.qualification || "",
                    experience: response.data.experience || "",
                    contact_number: response.data.contact_number || "",
                    department: response.data.department || "",
                    profile_picture: response.data.profile_picture || null
                });
                
                if (response.data.profile_picture) {
                    setPreviewUrl(`http://127.0.0.1:8000${response.data.profile_picture}`);
                }
            }

            setMessage("Profile updated successfully!");
            setTimeout(() => {
                navigate('/teacher/profile');
            }, 1500);
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response && error.response.data) {
                if (typeof error.response.data === 'object') {
                setErrors(error.response.data);
                } else {
                    setMessage(error.response.data);
                }
            } else {
                setMessage("An error occurred. Please try again.");
            }
        }
    };

    if (isLoading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingSpinnerStyle}></div>
                <p>Loading profile data...</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <Sidebar />
            <div style={mainContentStyle}>
            <div style={formContainerStyle}>
                    <h2 style={headingStyle}>Edit Teacher Profile</h2>
                    
                    {message && (
                        <div style={messageStyle(message.includes("success"))}>
                            {message}
                    </div>
                    )}
                    
                    {Object.keys(errors).length > 0 && (
                        <div style={errorContainerStyle}>
                            <p style={errorHeadingStyle}>Please fix the following errors:</p>
                            <ul style={errorListStyle}>
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter your username"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter your subject"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="qualification">Qualification</label>
                            <input
                                type="text"
                                id="qualification"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter your qualification"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="experience">Years of Experience</label>
                            <input
                                type="number"
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter years of experience"
                                min="0"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="contact_number">Contact Number</label>
                            <input
                                type="text"
                                id="contact_number"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                placeholder="Enter your contact number"
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle} htmlFor="department">Department</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">Select Department</option>
                                <option value="computer_science">Computer Science</option>
                                <option value="electronics">Electronics</option>
                                <option value="mechanical">Mechanical</option>
                                <option value="civil">Civil</option>
                                <option value="electrical">Electrical</option>
                                <option value="communication_media">Communication Media</option>
                            </select>
                        </div>

                        <div style={formGroupStyle}>
                            <label style={labelStyle}>Profile Picture</label>
                            <div style={fileUploadContainerStyle}>
                                <label htmlFor="profile_picture" style={fileUploadLabelStyle}>
                                    Choose New Picture
                                </label>
                                <input
                                    type="file"
                                    id="profile_picture"
                                    name="profile_picture"
                                    accept="image/*"
                                    onChange={handleChange}
                                    style={fileInputStyle}
                                />
                            </div>
                            {previewUrl && (
                                <div style={imagePreviewContainerStyle}>
                                    <img
                                        src={previewUrl}
                                        alt="Profile Preview"
                                        style={imagePreviewStyle}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={buttonContainerStyle}>
                            <button type="submit" style={submitButtonStyle}>
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/profile')}
                                style={cancelButtonStyle}
                            >
                                Cancel
                            </button>
                        </div>
                </form>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
};

const mainContentStyle = {
    flex: 1,
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
};

const formContainerStyle = {
    width: "100%",
    maxWidth: "800px",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff"
};

const headingStyle = {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontSize: "1.8rem"
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
};

const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
};

const labelStyle = {
    color: "#2c3e50",
    fontSize: "0.9rem",
    fontWeight: "500"
};

const inputStyle = {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    backgroundColor: "#f8f9fa"
};

const fileUploadContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
};

const fileUploadLabelStyle = {
    padding: "0.8rem",
    backgroundColor: "#3498db",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center",
    transition: "background-color 0.3s ease"
};

const fileInputStyle = {
    display: "none"
};

const imagePreviewContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem"
};

const imagePreviewStyle = {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "8px",
    border: "2px solid #3498db",
    objectFit: "cover"
};

const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem"
};

const submitButtonStyle = {
    flex: 1,
    padding: "0.8rem",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

const cancelButtonStyle = {
    flex: 1,
    padding: "0.8rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

const messageStyle = (isSuccess) => ({
    padding: "1rem",
    borderRadius: "6px",
    backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
    color: isSuccess ? "#155724" : "#721c24",
    marginBottom: "1rem",
    textAlign: "center"
});

const errorContainerStyle = {
    padding: "1rem",
    borderRadius: "6px",
    backgroundColor: "#f8d7da",
    marginBottom: "1rem"
};

const errorHeadingStyle = {
    color: "#721c24",
    marginBottom: "0.5rem",
    fontWeight: "bold"
};

const errorListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    color: "#721c24"
};

const loadingContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
};

const loadingSpinnerStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem"
};

export default TeacherProfileEdit;
