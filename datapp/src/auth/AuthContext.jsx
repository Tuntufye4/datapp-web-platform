import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (token && username && role) {
      setUser({ access: token, username, role });
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      // Step 1: Get JWT tokens
      const { data } = await api.post("/api/auth/login/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Step 2: Fetch user info from /me/
      const { data: userData } = await api.get("/api/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role);

      setUser({ access: data.access, username: userData.username, role: userData.role });
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Register function
  const register = async (payload) => {
    try {
      await api.post("/api/auth/register/", payload);
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
