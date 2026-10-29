
import { createContext, useContext, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/api";

const AuthContext = createContext(null);

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("taskflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [loading, setLoading] = useState(false);

  async function login(credentials) {
    setLoading(true);

    try {
      const result = await loginUser(credentials);

      setUser(result.user);
      localStorage.setItem("taskflow_user", JSON.stringify(result.user));

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
      localStorage.setItem("taskflow_user", JSON.stringify(result.user));

      return result;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    logoutUser();
    localStorage.removeItem("taskflow_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
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
