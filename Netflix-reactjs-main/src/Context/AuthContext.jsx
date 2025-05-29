import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const username = localStorage.getItem("username");
    if (token) {
      setUser({ token, isAdmin, username });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      const { token, username, isAdmin } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("username", username);
      setUser({ token, isAdmin, username });
      return true;
    } catch (err) {
      console.error(err.response.data.error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
