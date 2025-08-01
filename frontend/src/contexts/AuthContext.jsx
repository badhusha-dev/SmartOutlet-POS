
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      login: () => {},
      logout: () => {},
      register: () => {}
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check environment variables for development mode
  const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';
  const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';
  const MOCK_USER = import.meta.env.VITE_MOCK_USER === 'true';

  useEffect(() => {
    // In development mode with auth disabled, set mock user
    if (DEV_MODE && DISABLE_AUTH && MOCK_USER) {
      console.log('🔓 Development mode: Security disabled');
      setUser({
        id: 1,
        username: 'admin',
        email: 'admin@smartoutlet.com',
        role: 'ADMIN',
        name: 'System Administrator',
        token: 'mock-jwt-token'
      });
      setLoading(false);
      return;
    }

    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // In development mode, mock successful login
      if (DEV_MODE && DISABLE_AUTH) {
        const mockUser = {
          id: 1,
          username: credentials.username || 'admin',
          email: credentials.email || 'admin@smartoutlet.com',
          role: 'ADMIN',
          name: 'System Administrator',
          token: 'mock-jwt-token'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockUser.token);
        return { success: true, user: mockUser };
      }

      // TODO: Replace with actual API call
      // const response = await authApi.login(credentials);
      // setUser(response.user);
      // localStorage.setItem('user', JSON.stringify(response.user));
      // localStorage.setItem('token', response.token);
      
      return { success: false, message: 'Login API not implemented' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // In development mode, mock successful registration
      if (DEV_MODE && DISABLE_AUTH) {
        const mockUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          role: 'USER',
          name: userData.name || userData.username,
          token: 'mock-jwt-token'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockUser.token);
        return { success: true, user: mockUser };
      }

      // TODO: Replace with actual API call
      return { success: false, message: 'Registration API not implemented' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // In development mode, redirect to dashboard instead of login
    if (DEV_MODE && DISABLE_AUTH) {
      window.location.href = '/dashboard';
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
