// Login.jsx
import React, { useState } from 'react';
import './Login.css';
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Please sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <User className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
          
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;