import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  {console.log('isAuthorized: '+isAuthenticated)}

  if(isLoading)
    return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
