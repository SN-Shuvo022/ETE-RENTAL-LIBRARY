import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Signup() {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/signup', {
        name, email, password, roll
  
      });

      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">📚 Register for Library Access</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="signup-input"
            value={name}
            placeholder="👤 Full Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            className="signup-input"
            value={roll}
            placeholder="🎓 Roll Number"
            onChange={(e) => setRoll(e.target.value)}
            required
          />

          <input
            type="email"
            className="signup-input"
            value={email}
            placeholder="📧 Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="signup-input"
              value={password}
              placeholder="🔒 Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signup-footer">Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}
