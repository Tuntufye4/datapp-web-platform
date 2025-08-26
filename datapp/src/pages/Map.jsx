import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import yaml from "js-yaml";
import districtYaml from "/src/malawi_districts.yml?url"; // Vite import as URL

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const { user } = useAuth();      
  const base = baseByRole(user?.user_type);
  const [rows, setRows] = useState([]);
  const [districtCoords, setDistrictCoords] = useState({});
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    // Load YAML
    const loadYAML = async () => {
      const res = await fetch(districtYaml);
      const text = await res.text();
      const data = yaml.load(text);
      setDistrictCoords(data);
    };
    loadYAML();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(base);
        setRows(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [base]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Cases Map</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading || !Object.keys(districtCoords).length ? (
          <div className="p-6 text-center">Loading…</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden" style={{ height: 600 }}>
            <MapContainer
              center={[-13.2543, 34.3015]}
              zoom={7}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
              />
              {rows.map((r) => {
                const coords = districtCoords[r.district];
                if (!coords) return null;
                return (
                  <Marker key={r.id} position={coords}>
                    <Popup>
                      
                      {r.district}<br />  
                      {r.disease}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </main>
    </div>
  );
}
