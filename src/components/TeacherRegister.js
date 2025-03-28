import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const TeacherRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
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

    const departments = [
        { value: "commerce", label: "Commerce" },
        { value: "computer_applications", label: "Computer Applications" },
        { value: "social_work", label: "Social Work" },
        { value: "communication_media", label: "Communication and Media Studies" },
        { value: "applied_economics", label: "Applied Economics" },
        { value: "business_admin", label: "Business Administration" }
    ];

    // Handle input changes
    const handleChange = (e) => {
        if (e.target.name === "profile_picture") {
            const file = e.target.files[0];
            setFormData({ ...formData, profile_picture: file });
            // Create preview URL
            if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Handle form submission
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

            const response = await axios.post(
                "http://127.0.0.1:8000/api/teachers/register/",
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setMessage("Registration successful! Redirecting to login...");
            setFormData({
                username: "",
                email: "",
                password: "",
                subject: "",
                qualification: "",
                experience: "",
                contact_number: "",
                department: "",
                profile_picture: null
            });
            setPreviewUrl(null);

            setTimeout(() => {
                navigate("/teacherslog");
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <h2 style={{ marginBottom: "20px", color: "#333" }}>Teacher Registration</h2>

                {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}
                {Object.keys(errors).length > 0 && <p style={{ color: "red" }}>Please fix the errors below.</p>}

                <form onSubmit={handleSubmit} style={formStyle}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.username && <p style={errorStyle}>{errors.username}</p>}

                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.email && <p style={errorStyle}>{errors.email}</p>}

                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.password && <p style={errorStyle}>{errors.password}</p>}

                    <select 
                        name="department" 
                        value={formData.department} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle}
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.value} value={dept.value}>
                                {dept.label}
                            </option>
                        ))}
                    </select>
                    {errors.department && <p style={errorStyle}>{errors.department}</p>}

                    <input 
                        type="text" 
                        name="subject" 
                        placeholder="Subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.subject && <p style={errorStyle}>{errors.subject}</p>}

                    <input 
                        type="text" 
                        name="qualification" 
                        placeholder="Qualification" 
                        value={formData.qualification} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.qualification && <p style={errorStyle}>{errors.qualification}</p>}

                    <input 
                        type="number" 
                        name="experience" 
                        placeholder="Experience (Years)" 
                        value={formData.experience} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.experience && <p style={errorStyle}>{errors.experience}</p>}

                    <input 
                        type="text" 
                        name="contact_number" 
                        placeholder="Contact Number" 
                        value={formData.contact_number} 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    {errors.contact_number && <p style={errorStyle}>{errors.contact_number}</p>}

                    <div style={fileUploadContainerStyle}>
                        <label htmlFor="profile_picture" style={fileUploadLabelStyle}>
                            Choose Profile Picture
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
                    {errors.profile_picture && <p style={errorStyle}>{errors.profile_picture}</p>}

                    <button type="submit" style={buttonStyle}>Register</button>
                    <div style={signupLinkStyle}>
                        Already have an account?{" "}
                        <span 
                            onClick={() => navigate("/teacherslog")} 
                            style={linkStyle}
                        >
                            Login here
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "20px"
};

const formContainerStyle = {
    width: "400px",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    textAlign: "center"
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px"
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    "&:hover": {
        backgroundColor: "#0056b3"
    }
};

const errorStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "-5px"
};

const fileUploadContainerStyle = {
    width: "100%",
    marginBottom: "10px"
};

const fileUploadLabelStyle = {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#e9ecef",
    color: "#495057",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px solid #ced4da",
    width: "100%",
    textAlign: "center"
};

const fileInputStyle = {
    display: "none"
};

const imagePreviewContainerStyle = {
    width: "100%",
    marginTop: "10px",
    textAlign: "center"
};

const imagePreviewStyle = {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "5px",
    border: "1px solid #ddd"
};

const signupLinkStyle = {
    marginTop: "15px",
    textAlign: "center",
    color: "#666"
};

const linkStyle = {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline"
};

export default TeacherRegister;
