
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectBoard from "./pages/ProjectBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/global.css";

function AppRoutes() {
  const navigate = useNavigate();
  const go = (path) => navigate(path);

  return (
    <Routes>
      <Route path="/" element={<Dashboard onNavigate={go} />} />
      <Route path="/projects" element={<Projects onNavigate={go} />} />
      <Route path="/projects/:id" element={<ProjectBoard onNavigate={go} />} />
      <Route path="/tasks" element={<ProjectBoard onNavigate={go} />} />
      <Route path="/login" element={<Login onNavigate={go} />} />
      <Route path="/register" element={<Register onNavigate={go} />} />
      <Route path="*" element={<Dashboard onNavigate={go} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
