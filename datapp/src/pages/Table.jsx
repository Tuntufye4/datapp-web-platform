import { useEffect, useState } from "react"; 
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";  
import { useNavigate } from "react-router-dom";

export default function TablePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const base = baseByRole(user?.role);
  const [rows, setRows] = useState([]);   
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {   
    const load = async () => {
      try {
        const { data } = await api.get(base);
        // Sort by ID ascending
        const sortedData = data.sort((a, b) => a.id - b.id);
        setRows(sortedData);
      } catch (e) { 
        console.error(e); 
        if (e.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          logout();
          navigate("/login");
        } else {
          setError("Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();  
  }, [base, logout, navigate]);

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Cases</h1>
        </div>
      </header>

      {/* Table Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["ID","Patient","District","Disease","Diagnosis","Treatment"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.patient_name}</td>
                  <td className="px-3 py-2">{r.district}</td>
                  <td className="px-3 py-2">{r.disease}</td>
                  <td className="px-3 py-2">{r.diagnosis}</td>
                  <td className="px-3 py-2">{r.treatment}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={6}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
