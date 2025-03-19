import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  return user ? children : (
    <div className="container mt-4 text-center">
      <h2>Access Denied</h2>
      <p>This page is restricted to registered users only.</p>
      <p>You will be redirected to the <strong>Login</strong> page in 5 seconds.</p>
    </div>
  );
};

export default ProtectedRoute;
