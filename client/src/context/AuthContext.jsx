
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Auto-login on app load
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include", // cookies sent automatically
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(userData => {
        setUser(userData);
        // redirect based on role
        if (userData.role === "admin") navigate("/admin");
        else if (userData.role === "chef") navigate("/chef");
        else navigate("/dashboard");
      })
      .catch(() => navigate("/login"));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
