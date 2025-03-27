import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => navigate("/login"), 5000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return user ? children : (
    <div className="container mt-4 text-center">
      <h2>Access Denied</h2>
      <p>This page is restricted to registered users only.</p>
      <p>You will be redirected to the <strong>Login</strong> page in 5 seconds.</p>
    </div>
  );
};

export default ProtectedRoute;
