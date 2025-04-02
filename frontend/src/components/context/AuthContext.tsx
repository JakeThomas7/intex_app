// AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { pingauth } from '../../api/AuthenticationAPI';
import User from '../../types/User';

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  checkAuth: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await pingauth();

      if (data.email) {
        setUser({ 
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          adminStatus: data.adminStatus
        });
        setIsAuth(true);
      } else {
        throw new Error('Invalid user session');
      }
    } catch (error) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}