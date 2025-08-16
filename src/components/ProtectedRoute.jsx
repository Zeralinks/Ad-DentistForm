// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../api';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    authorize().catch(() => setIsAuthorized(false));
  }, [location]); 

  async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      setIsAuthorized(false);
      return;
    }

    try {
      const response = await api.post('/api/token/refresh/', { refresh });
      if (response.status === 200) {
        localStorage.setItem("access", response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error('Refresh token error:', err);
      setIsAuthorized(false);
    }
  }

  async function authorize() {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("You must be logged in to view this page");
      setIsAuthorized(false);
      return;
    }

    try {
      const decodeToken = jwtDecode(token);
      const expiry_date = decodeToken.exp;
      const current_time = Date.now() / 1000;

      if (current_time > expiry_date) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (err) {
      console.error('Token decode error:', err);
      setIsAuthorized(false);
    }
  }

  if (isAuthorized === null) {
    return <Spinner />;
  }

  return isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;