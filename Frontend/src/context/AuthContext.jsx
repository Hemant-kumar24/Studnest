import { createContext, useContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const normaliseUser = (value) => {
    if (!value) return null;

    const role = value.role === "user" ? "student" : value.role;

    return { ...value, role };
  };

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("user"));

      if (saved) return normaliseUser(saved);

      const token = localStorage.getItem("token");

      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      return normaliseUser({
        ...payload,
        role: payload.role || localStorage.getItem("role"),
      });
    } catch {
      return null;
    }
  });

  const login = (payload) => {
    const authenticatedUser = normaliseUser(payload.user);

    localStorage.setItem("token", payload.token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("role", authenticatedUser.role);

    setToken(payload.token);
    setUser(authenticatedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading: false,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);