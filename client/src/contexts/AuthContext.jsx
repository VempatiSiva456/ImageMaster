import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const checkSession = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verifySession",
        {
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          localStorage.setItem("role", data.user.role);
          setUserRole(data.user.role);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", data.user.role);
        setUserRole(data.user.role);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setUserRole(null);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, login, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
