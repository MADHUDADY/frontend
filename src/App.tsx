import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* First Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard After Login */}
        <Route path="/dashboard/*" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}