import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

export default function ClientMap({ markers = [] }) {  
  return (
    <MapContainer center={[-13.2543, 34.3015]} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers
        .filter((m) => m.latitude && m.longitude)
        .map((m) => (      
          <Marker key={m.id} position={[m.latitude, m.longitude]}>
            <Popup>
              <div className="font-semibold">{m.patient_name}</div>
              <div>District: {m.district}</div>
              <div>Disease: {m.disease}</div>
              <div>Date: {m.date_reported}</div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
      