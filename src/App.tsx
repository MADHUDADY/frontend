import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./Dashboard";
import { AuthProvider } from "./context/AuthContext";

// ── Role-based route guards ───────────────────────────────────────────────────

// Any logged-in user (Admin + Reception + Staff + Call Centre)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token || !role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Admin only — Reception/Staff redirect to dashboard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/" replace />;
  if (role !== "Admin" && role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>   {/* ← here because useNavigate needs BrowserRouter above it */}
        <Routes>

          {/* ── Public ── */}
          <Route path="/" element={<Login />} />

          {/* ── Any logged-in user ── */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}