import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";
import ClientMap from "../components/ClientMap";

export default function MapPage() {
  const { user } = useAuth();
  const base = baseByRole(user?.user_type);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(base);
        setRows(data);
      } catch (e) { console.error(e); }
    };
    load();
  }, [base]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cases Map</h1>
      <div className="bg-white rounded-xl shadow" style={{ height: 600 }}>
        <ClientMap markers={rows} />
      </div>
    </main>
  );
}
        