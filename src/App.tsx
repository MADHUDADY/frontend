import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login          from "./components/login";
import Dashboard      from "./Dashboard";
import KioskPage      from "./pages/KioskPage";
import QueueDisplay   from "./pages/QueueDisplay";
import { AuthProvider } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token || !role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

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
      <AuthProvider>
        <Routes>

          {/* ── Public — no login needed ── */}
          <Route path="/"      element={<Login />} />
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="/queue" element={<QueueDisplay />} />  {/* ← TV Queue Display */}

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