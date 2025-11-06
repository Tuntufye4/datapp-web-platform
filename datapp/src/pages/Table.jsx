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
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {   
    const load = async () => {
      try {
        const { data } = await api.get(base);
        const sortedData = data.sort((a, b) => a.id - b.id);
        setRows(sortedData);
        setFilteredRows(sortedData);
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

  // Handle search filter
  useEffect(() => {
    if (!search) {
      setFilteredRows(rows);
    } else {
      const term = search.toLowerCase();
      setFilteredRows(
        rows.filter(r =>  
          Object.values(r).some(val =>
            String(val).toLowerCase().includes(term)
          )
        )
      );
    }
  }, [search, rows]);

  // Export to CSV
  const exportCSV = () => {
    const headers = ["ID","Patient","District","Disease","Diagnosis","Treatment","Visit_type"];
    const csvRows = [
      headers.join(","), // header row
      ...filteredRows.map(r =>
        [r.id, r.patient_name, r.district, r.disease, r.diagnosis, r.treatment, r.visit_type].join(",")
      )
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /*if (loading) return <div className="p-6 text-center">Loading…</div>; */   
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        </div>
      </header>

      {/* Search + Export */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <input
          type="text"
          placeholder="Search cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={exportCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Table Content */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["ID","Patient","District","Disease","Diagnosis","Treatment","Visit type"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.id}</td>
                  <td className="px-3 py-2">{r.patient_name}</td>
                  <td className="px-3 py-2">{r.district}</td>
                  <td className="px-3 py-2">{r.disease}</td>
                  <td className="px-3 py-2">{r.diagnosis}</td>
                  <td className="px-3 py-2">{r.treatment}</td>  
                  <td className="px-3 py-2">{r.visit_type}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr><td className="px-3 py-4 text-gray-500" colSpan={6}>No matching cases</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
   