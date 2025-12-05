import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // null means no user yet
  const [loading, setLoading] = useState(true); // stops redirect flicker

  // Called after login
  const login = (username) => {
    setUser({ username });
  };

  // Called after logout
  const logout = async () => {
  try {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  setUser(null);
};


  // --------------------------------------------------
  // CHECK LOGIN STATUS ON PAGE RELOAD
  // --------------------------------------------------
  const checkAuth = async () => {
    try {
      const res = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
