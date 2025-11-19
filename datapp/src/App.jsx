import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClinicalTablePage from "./pages/table_list/clinical_list";   
import DemographicsTablePage from "./pages/table_list/demographics_list";   
import EnvTablePage from "./pages/table_list/env_risk_factors";    
import ClinicalReportPage from "./pages/reports/clinical_details";   
import DemographicsReportPage from "./pages/reports/demographics_report";
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
          <Route path="/table_list/clinical_list" element={<Private><ClinicalTablePage/></Private>} />
          <Route path="/table_list/demographics_list" element={<Private><DemographicsTablePage/></Private>} />
          <Route path="/table_list/env_risk_factors" element={<Private><EnvTablePage/></Private>} />
          <Route path="/reports/clinical_details" element={<Private><ClinicalReportPage /></Private>} />
          <Route path="/reports/demographics_report" element={<Private><DemographicsReportPage /></Private>} />
          <Route path="/map" element={<Private><MapPage /></Private>} />   

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}   
            