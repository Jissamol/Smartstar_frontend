import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PendingTeachers.css";

const PendingTeachers = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  // Memoize department mapping to prevent re-creation
  const departmentLabels = useMemo(
    () => ({
      computer_science: "Computer Science",
      electronics: "Electronics",
      mechanical: "Mechanical",
      civil: "Civil",
      electrical: "Electrical",
      communication_media: "Communication Media",
    }),
    []
  );

  // Fetch pending teachers from API
  const fetchPendingTeachers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/teachers/pending/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Sort teachers by department
      const teachers = response.data.sort((a, b) => {
        const deptA = departmentLabels[a.department] || "";
        const deptB = departmentLabels[b.department] || "";
        return deptA.localeCompare(deptB);
      });

      setPendingTeachers(teachers);
      setFilteredTeachers(teachers);

      // Extract unique departments
      const uniqueDepartments = ["All", ...new Set(teachers.map((t) => t.department))];
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      if (err.response?.status === 401) {
        navigate("/admin-login");
      }
      setError(err.response?.data?.error || "Failed to load pending teachers.");
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Removed departmentLabels from dependencies

  useEffect(() => {
    fetchPendingTeachers();
  }, [fetchPendingTeachers]);

  // Filter teachers based on department
  const handleFilterChange = (department) => {
    setSelectedDepartment(department);
    if (department === "All") {
      setFilteredTeachers(pendingTeachers);
    } else {
      const filtered = pendingTeachers.filter((teacher) => teacher.department === department);
      setFilteredTeachers(filtered);
    }
  };

  // Approve or reject teacher
  const handleTeacherAction = async (teacherId, action) => {
    setActionMessage("");
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        navigate("/admin-login");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/teachers/${teacherId}/action/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        setActionMessage(response.data.message);
        fetchPendingTeachers(); // Manually refetch after action
      }
    } catch (err) {
      console.error("Error during teacher action:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        navigate("/admin-login");
        return;
      }

      if (err.response?.status === 403) {
        setError("You don't have permission to perform this action.");
        return;
      }

      setActionMessage(err.response?.data?.error || `Failed to ${action} teacher. Please try again.`);
    }
  };

  return (
    <div className="pending-teachers-page">
      {/* Header */}
      <header className="admin-header">
        <h1>Pending Teachers</h1>
        <button onClick={() => navigate("/admin-dashboard")} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      {/* Department Filter */}
      <div className="filter-container">
        <label htmlFor="department">Filter by Department: </label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="department-select"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "All" ? "All Departments" : departmentLabels[dept]}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      {actionMessage && <div className="action-message">{actionMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Teachers Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="no-teachers">No pending teachers in the selected department.</div>
        ) : (
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="profile-cell">
                    {teacher.profile_picture ? (
                      <img
                        src={`http://127.0.0.1:8000${teacher.profile_picture}`}
                        alt={`${teacher.username}'s profile`}
                        className="profile-thumbnail"
                      />
                    ) : (
                      <div className="no-profile">No Photo</div>
                    )}
                  </td>
                  <td>{teacher.username}</td>
                  <td>{departmentLabels[teacher.department]}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.qualification}</td>
                  <td>{teacher.experience} years</td>
                  <td>{teacher.contact_number}</td>
                  <td className="action-cell">
                    <button
                      className="approve-btn"
                      onClick={() => handleTeacherAction(teacher.id, "approve")}
                      title="Approve Teacher"
                    >
                      ✓
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleTeacherAction(teacher.id, "reject")}
                      title="Reject Teacher"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingTeachers;
