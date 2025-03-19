import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;