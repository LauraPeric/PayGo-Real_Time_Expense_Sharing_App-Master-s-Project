import React, { createContext, useState, useContext } from 'react';
import { User, AuthContextType } from '../types/index';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, username?: string) => {
    // stvaranje username-a od prvog dijela emaila
    const generatedUsername = username || email.split('@')[0];
    setUser({ email, username: generatedUsername });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);