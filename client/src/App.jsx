import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/admin/Login/Login';
import Signup from './pages/admin/Signup/Signup';
import LandingPage from './pages/LandingPage/LandingPage';

import Layout from './pages/admin/Layout/Layout';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import ChatCenter from './pages/admin/ChatCenter/ChatCenter';
import Analytics from './pages/admin/Analytics/Analytics';
import Chatbot from './pages/admin/Chatbot/Chatbot';
import Teams from './pages/admin/Teams/Teams';
import Settings from './pages/admin/Settings/Settings';

import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />



      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
    
        <Route index element={<Dashboard />} />

      
        <Route path="chat-center" element={<ChatCenter />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="settings" element={<Settings />} />

        <Route 
          path="teams" 
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />

        <Route 
          path="analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
};

export default App;


