import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TablePage from "./pages/Table";
import ReportPage from "./pages/Report";
import MapPage from "./pages/Map";    
import { useAuth } from "./auth/AuthContext";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <Sidebar />}

      <div className={user ? "pl-64 min-h-screen" : "min-h-screen"}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/table" element={<Private><TablePage /></Private>} />
          <Route path="/report" element={<Private><ReportPage /></Private>} />
          <Route path="/map" element={<Private><MapPage /></Private>} />

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
      