

import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Auto load user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const res = await axiosInstance.post("/auth/login", { email, password });
      
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      toast.success("✅ Login successful!");

      // Redirect by role
      if (res.data.user.role === "owner") navigate("/owner/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      setLoading(true);
      setError(null);

      if (!data.name || !data.email || !data.password) {
        throw new Error("All fields are required");
      }

      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const res = await axiosInstance.post("/auth/signup", data);
      
      toast.success("✅ Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Signup failed";
      setError(message);
      toast.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setError(null);
    delete axiosInstance.defaults.headers.common["Authorization"];
    toast.success("✅ Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};