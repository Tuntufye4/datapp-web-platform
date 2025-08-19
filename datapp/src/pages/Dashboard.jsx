import { useEffect, useState } from "react";
import Card from "../components/Card";
import api from "../api/api";   
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#2563eb","#16a34a","#dc2626","#9333ea","#f59e0b","#06b6d4"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const base = baseByRole(user?.role);
  const [stats, setStats] = useState({ total_cases: 0, female_cases: 0, male_cases: 0 });
  const [byDistrict, setByDistrict] = useState([]);
  const [diseaseDist, setDiseaseDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: s }, { data: b }, { data: p }] = await Promise.all([
          api.get(`${base}statistics/`),
          api.get(`${base}by-district/`),
          api.get(`${base}disease-distribution/`),
        ]);
        setStats(s);
        setByDistrict(b.map((i) => ({ district: i.district, count: i.count })));
        setDiseaseDist(p.map((i) => ({ disease: i.disease, count: i.count })));
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          logout();
          // optional: navigate to login if you use react-router
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [base, logout]);

  const cards = [
    { title: "Total Cases", value: stats.total_cases, accent: "text-blue-600" },
    { title: "Female Cases", value: stats.female_cases, accent: "text-pink-600" },
    { title: "Male Cases", value: stats.male_cases, accent: "text-teal-600" },
  ];

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <main className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card key={c.title} title={c.title}>
            <div className={`text-3xl font-bold ${c.accent}`}>{c.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Cases by District">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDistrict}>
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
           
        <Card title="Disease Distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={diseaseDist} dataKey="count" nameKey="disease" cx="50%" cy="50%" outerRadius={90} label>
                  {diseaseDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </main>
  );
}
