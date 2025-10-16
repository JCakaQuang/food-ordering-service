'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
}

interface ProfileData {
    userId: string;
    email: string;
    name: string;
    role: string;
}

interface LoginResponse {
    access_token: string;
    user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
          // Lấy thông tin cơ bản từ token
          const profileResponse = await axios.get<ProfileData>(`${API_URL}/auth/profile`);
          const profileData = profileResponse.data;

          // Dùng userId để lấy thông tin chi tiết của user
          const userDetailsResponse = await axios.get<User>(`${API_URL}/users/${profileData.userId}`);
          setUser(userDetailsResponse.data);

        } catch (error) {
          console.error('Failed to fetch profile, logging out.', error);
          // Gọi hàm logout nội bộ để dọn dẹp state
          setUser(null);
          setToken(null);
          localStorage.removeItem('access_token');
          delete axios.defaults.headers.common['Authorization'];
          router.push('/auth/login');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [router]); // Thêm router vào dependency array

  const login = async (data: any) => {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
    const { access_token, user: userData } = response.data;
    
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('access_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
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

  const updateUser = (newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...newUserData };
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
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

