import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  phoneNumber: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithPassword: (phoneNumber: string, password: string) => Promise<void>;
  register: (name: string, phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // On mount, if token exists but user is not set, try fetching current user
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const res = await api.get('/api/auth/me');
          const u = res?.data || res;
          setUser({ id: u.id, phoneNumber: u.phone, name: u.name });
        } catch (err: any) {
          // Clear token if unauthorized or request failed
          try {
            if (err?.status === 401) {
              localStorage.removeItem('token');
            }
          } catch {}
          localStorage.removeItem('token');
        }
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (phoneNumber: string) => {
    // Send OTP via backend
    try {
      await api.post('/api/auth/send-otp', { phone: phoneNumber });
    } catch (e: any) {
      const msg = e?.body?.message || e?.message || 'Failed to send OTP';
      throw new Error(msg);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const res = await api.post('/api/auth/verify-otp', { phone: phoneNumber, otp });
      const { token, user } = res?.data || res;
      if (token) localStorage.setItem('token', token);
      setUser({ id: user.id, phoneNumber: user.phone, name: user.name });
    } catch (e: any) {
      const msg = e?.body?.message || e?.message || 'Invalid OTP';
      if (e?.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(msg);
    }
  };

  const loginWithPassword = async (phoneNumber: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { phone: phoneNumber, password });
      const { token, user } = res?.data || res;
      if (token) localStorage.setItem('token', token);
      setUser({ id: user.id, phoneNumber: user.phone, name: user.name });
    } catch (e: any) {
      if (e?.status === 401) localStorage.removeItem('token');
      const msg = e?.body?.message || e?.message || 'Invalid credentials';
      throw new Error(msg);
    }
  };

  const register = async (name: string, phoneNumber: string, password: string) => {
    try {
      const res = await api.post('/api/auth/register', { name, phone: phoneNumber, password });
      const { token, user } = res?.data || res;
      if (token) localStorage.setItem('token', token);
      setUser({ id: user.id, phoneNumber: user.phone, name: user.name });
    } catch (e: any) {
      const msg = e?.body?.message || e?.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      api.post('/api/auth/logout').catch(() => {});
    } catch {}
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login,
      verifyOTP,
      loginWithPassword,
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
