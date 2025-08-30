import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Add this at top

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('role', res.data.role);

      // ✅ Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      alert('Login successful!');

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">🔐 Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            value={email}
            placeholder="📧 Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
             <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                value={password}
                placeholder="🔒 Password"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
             <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                 {showPassword ? <FaEyeSlash /> : <FaEye />}
             </span>
          </div>


          <div className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="remember"
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">Don't have an account? <a href="/signup">Sign up here</a></p>
      </div>
    </div>
  );
}
