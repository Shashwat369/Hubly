import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './AuthForm.css'; 

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  

  const { login } = useAuth(); 
  const navigate = useNavigate();

 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const API = import.meta.env.VITE_API_URL;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
   
        const loginPayload = {
          username: formData.email, 
          password: formData.password
        };

        const res = await axios.post(`${API}/api/users/login`, loginPayload);

        

        const { token, ...userData } = res.data;


        login(userData, token);
        
        alert(`Login Success! Welcome back ${userData.firstName}`);
        

        navigate('/'); 

      } else {
       
        const res = await axios.post(`${API}/api/users/signup`, formData);

        
        alert(res.data.message); 
        setIsLogin(true); 
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#1C355E' }}>
        {isLogin ? 'Log In' : 'Admin Signup'}
      </h2>
      
      {message && <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

      <form onSubmit={handleSubmit}>
        
        {!isLogin && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>First Name</label>
              <input 
                type="text" name="firstName" 
                value={formData.firstName} onChange={handleChange} required 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Last Name</label>
              <input 
                type="text" name="lastName" 
                value={formData.lastName} onChange={handleChange} required 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Email</label>
          <input 
            type="email" name="email" 
            value={formData.email} onChange={handleChange} required 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Password</label>
          <input 
            type="password" name="password" 
            value={formData.password} onChange={handleChange} required 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#1C355E', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Login' : 'Create Admin Account'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isLogin ? "First time here? " : "Already have an account? "}
        <span 
          onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
          style={{ color: '#3B82F6', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;