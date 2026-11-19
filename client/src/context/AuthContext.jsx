
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import authApi from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the user already has a valid session.
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await authApi.getCurrentUser();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Register a new student.
  const register = async (userData) => {
    const response = await authApi.register(userData);
    setUser(response.user);
    return response;
  };

  // Log in an existing user.
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    setUser(response.user);
    return response;
  };

  // Log out the current user.
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}
