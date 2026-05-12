// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

type UserInfo = {
  name:     string;
  role:     string;
  empId:    string;
  centerId: string;
};

type AuthContextType = {
  user:    UserInfo | null;
  token:   string | null;
  ready:   boolean;
  login:   (tokenStr: string, userData: any) => void;
  logout:  () => void;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user,  setUser]  = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // App open అయినప్పుడు localStorage చదువు
  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("user");
    const e = localStorage.getItem("empId");
    const c = localStorage.getItem("centerId");

    if (t && r) {
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          setToken(t);
          setUser({ name: n || "", role: r, empId: e || "", centerId: c || "" });
        } else {
          clearStorage();
        }
      } catch {
        clearStorage();
      }
    }
    setReady(true);
  }, []);

  // Token expire అయినప్పుడు auto logout
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ms = payload.exp * 1000 - Date.now();
      if (ms <= 0) { logout(); return; }
      const t = setTimeout(() => { alert("Session expired. Please login again."); logout(); }, ms);
      return () => clearTimeout(t);
    } catch { logout(); }
  }, [token]);

  const clearStorage = () =>
    ["token", "user", "role", "empId", "centerId"].forEach(k => localStorage.removeItem(k));

  // Login success తర్వాత call చేయి
  const login = useCallback((tokenStr: string, userData: any) => {
    const name     = userData.EMPNAME  ?? userData.name     ?? "";
    const role     = userData.ROLE     ?? userData.role     ?? "";
    const empId    = userData.EMPID    ?? userData.empId    ?? "";
    const centerId = userData.CENTERID ?? userData.centerId ?? "";

    localStorage.setItem("token",    tokenStr);
    localStorage.setItem("user",     name);
    localStorage.setItem("role",     role);
    localStorage.setItem("empId",    empId);
    localStorage.setItem("centerId", centerId);

    setToken(tokenStr);
    setUser({ name, role, empId, centerId });
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const isAdmin = () => ["Admin", "ADMIN"].includes(user?.role ?? "");

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};