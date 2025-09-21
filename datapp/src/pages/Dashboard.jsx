import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,    
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";
import {
  ChartBarIcon,
  ChartPieIcon,
  UsersIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b", "#06b6d4"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const base = baseByRole(user?.role);

  const [stats, setStats] = useState({ total_cases: 0, confirmed_cases: 0, probable_cases: 0 });
  const [byDistrict, setByDistrict] = useState([]);
  const [diseaseDist, setDiseaseDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);        
  const [error, setError] = useState(null);

  useEffect(() => {          
    const loadData = async () => {
      try {
        const [{ data: s }, { data: b }, { data: p }] = await Promise.all([
          api.get(`${base}statistics/`),
          api.get(`${base}by-district/`),
          api.get(`${base}disease-distribution/`),
        ]);

        setStats(s);
        setByDistrict(b.map((i) => ({ name: i.district, cases: i.count })));
        setDiseaseDist(p.map((i) => ({ name: i.disease, value: i.count })));

        setTimeout(() => setVisible(true), 200); // trigger fade/slide animation
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          logout();
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [base, logout]);

  const cards = [
    { title: "Total Cases", value: stats.total_cases, accent: "text-blue-600", icon: UsersIcon },
    { title: "Confirmed Cases", value: stats.confirmed_cases, accent: "text-pink-600", icon: UserIcon },
    { title: "Probable Cases", value: stats.probable_cases, accent: "text-teal-600", icon: UserGroupIcon },
  ];

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-700 ease-out transform ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-6 h-6 ${card.accent} transition-all duration-700 ease-out transform ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  />
                  <h2
                    className={`text-lg font-medium text-gray-600 transition-all duration-700 ease-out transform ${
                      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    {card.title}
                  </h2>
                </div>
                <p
                  className={`mt-2 text-3xl font-bold ${card.accent} transition-all duration-700 ease-out transform ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Bar Chart */}
          <div
            className={`bg-white p-6 rounded-2xl shadow transition-all duration-1000 ease-out transform ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon
                className={`w-6 h-6 text-gray-600 transition-all duration-1000 ease-out transform ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              />
              <h2
                className={`text-lg font-semibold transition-all duration-1000 ease-out transform ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Cases by District
              </h2>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDistrict}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div
            className={`bg-white p-6 rounded-2xl shadow transition-all duration-1000 ease-out transform ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <ChartPieIcon
                className={`w-6 h-6 text-gray-600 transition-all duration-1000 ease-out transform ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              />
              <h2
                className={`text-lg font-semibold transition-all duration-1000 ease-out transform ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Disease Distribution
              </h2>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {diseaseDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
