import { useState } from 'react';

export interface User {
  name: string;
  email: string;
}

export const useMockAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    setIsAuthenticated(true);
    setUser({ name: email.split('@')[0], email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, login, logout };
};
