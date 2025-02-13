import React from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import GuestHome from "./components/GuestHome";
function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<GuestHome />} />
      </Routes>
    </Router>
  );
}

export default App;
