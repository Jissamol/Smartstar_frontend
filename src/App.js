import React from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import GuestHome from "./components/GuestHome";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import TeachersLogin from "./components/TeachersLogin";
import StudentLogin from "./components/StudentLogin";
import TeacherRegister from "./components/TeacherRegister";
import AdminDashboard from "./components/AdminDashboard";
import PendingTeachers from "./components/PendingTeachers";
import TeacherDashboard from "./components/TeacherDashboard";
import TeacherProfile from "./components/TeacherProfile";
import TeacherProfileEdit from "./components/TeacherProfileEdit";
import TeacherStudents from './components/TeacherStudents';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/adminlog" element={<AdminLogin />} />
        <Route path="/teacherslog" element={<TeachersLogin />} />
        <Route path="/studentslog" element={<StudentLogin />} />
        <Route path="/teachersreg" element={<TeacherRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pending-teachers" element={<PendingTeachers />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/profile/edit" element={<TeacherProfileEdit />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
