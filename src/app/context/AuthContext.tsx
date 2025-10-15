'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho user
interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Lấy thông tin user từ profile
          const response = await axios.get(`${API_URL}/auth/profile`);
          const data = response.data as {
            userId: string;
            email: string;
            name: string;
            role: string;
          };
          setUser({
            _id: data.userId, 
            email: data.email,
            name: data.name,
            role: data.role,
          });
        } catch (error) {
          console.error('Failed to fetch profile, logging out.', error);
          logout(); // Nếu token không hợp lệ, đăng xuất
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (data: any) => {
    interface LoginResponse {
      access_token: string;
      user: User;
    }
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
    const { access_token, user: userData } = response.data;
    
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('access_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    // Điều hướng dựa trên vai trò
    if (userData.role.toLowerCase() === 'admin') {
      router.push('/admin/users');
    } else {
      router.push('/');
    }
  };

  const register = async (data: any) => {
    return await axios.post(`${API_URL}/auth/register`, data);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};