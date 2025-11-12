import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
            const response = await api.get('/auth/user');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
            setUser(null);
        }
        }
        setLoading(false);
    };
    fetchUser();
    }, [token]);
const login = async (email, password) => {
    try{
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        navigate('/');
        window.location.reload();
    }
    catch (error){
        const errorMsg = error.response?.data?.msg || error.message || 'Login failed';
        throw new Error(errorMsg);
    }
};
const register = async (email, password) => {
    try{
        const response = await api.post('/auth/register', { email, password });
        localStorage.setItem('token', response.data.token);
        navigate('/');
        window.location.reload();
    }
    catch (error){
        const errorMsg = error.response?.data?.msg || error.message || 'Registration failed';
        throw new Error(errorMsg);
    }
};
const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    window.location.reload();
};
    return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
        {children}
    </AuthContext.Provider>
    );
}
