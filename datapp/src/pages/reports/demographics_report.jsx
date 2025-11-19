// src/components/Report.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import html2pdf from "html2pdf.js";
import {
  UsersIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

const base = "/api/"; // adjust if your API prefix differs

export default function DemographicsReportPage() {
  const [stats, setStats] = useState({ total_cases: 0, female_cases: 0, male_cases: 0 });
  const [byDistrict, setByDistrict] = useState([]);
  const [diseaseDist, setDiseaseDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: s }, { data: b }, { data: p }] = await Promise.all([
          api.get(`${base}statistics/`),
          api.get(`${base}by-district/`),  
          api.get(`${base}disease-distribution/`),
        ]);

        setStats(s);
        setByDistrict(b);
        setDiseaseDist(p);
      } catch (err) {
        setError("Failed to load report data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadPDF = () => {
    if (reportRef.current) {
      const opt = {
        margin: 0.5,
        filename: "Analytics_Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(reportRef.current).set(opt).save();
    }
  };

  if (loading) return <div className="p-4">Loading report...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const cards = [
    {
      title: "Total Cases",
      value: stats.total_cases,
      icon: UsersIcon,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Female Cases",
      value: stats.female_cases,
      icon: UserIcon,
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "Male Cases",
      value: stats.male_cases,
      icon: UserGroupIcon,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Report</h1>
        <button
          onClick={downloadPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Download PDF
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-8 bg-white shadow-lg rounded-xl p-6">
        {/* Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <div key={idx} className="flex items-center bg-gray-50 rounded-xl p-4 shadow">
              <div className={`p-3 rounded-full mr-4 ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">{c.title}</h3>
                <p className="text-xl font-bold">{c.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Cases by District */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Cases by District</h2>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">District</th>
                <th className="p-2 text-left">Cases</th>
              </tr>
            </thead>
            <tbody>
              {byDistrict.map((d, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{d.district}</td>
                  <td className="p-2">{d.cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Disease Distribution */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Disease Distribution</h2>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Disease</th>
                <th className="p-2 text-left">Cases</th>
              </tr>
            </thead>
            <tbody>
              {diseaseDist.map((d, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{d.disease}</td>
                  <td className="p-2">{d.cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}   
