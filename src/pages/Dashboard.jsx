import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center">
          <h2>Access Denied</h2>
          <p>This page is restricted to registered users only.</p>
          <p>Please <Link to="/login">Login</Link> to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
