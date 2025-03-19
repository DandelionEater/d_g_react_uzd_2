import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tikriname, ar username arba email jau egzistuoja
      const userCheckResponse = await fetch(`http://localhost:3000/users?username=${formData.username}`);
      const existingUsers = await userCheckResponse.json();

      const emailCheckResponse = await fetch(`http://localhost:3000/users?email=${formData.email}`);
      const existingEmails = await emailCheckResponse.json();

      if (existingUsers.length > 0) {
        setError("Username already taken!");
        setLoading(false);
        return;
      }

      if (existingEmails.length > 0) {
        setError("Email already registered!");
        setLoading(false);
        return;
      }

      // Jei vartotojo nėra, įrašome naują
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        login(formData); // Automatiškai prisijungiame
        navigate("/dashboard"); // Peradresuojame į Dashboard
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="mt-3">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
