
import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(credentials) {
    setLoading(true);
    try {
      const result = await loginUser(credentials);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function register(details) {
    setLoading(true);
    try {
      const result = await registerUser(details);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
