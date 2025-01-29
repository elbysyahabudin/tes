import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from '../Assets/wyloz-logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      onLogin(true); // Set authentication state
      navigate("/"); // Redirect to dashboard
    } else {
      alert("Invalid credentials. Try username: admin, password: password");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
      <img src={loginImg} alt="Login Icon" className="login-icon" />
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;