import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { baseByRole } from "../utils/roles";

export default function ReportPage() {
  const { user } = useAuth();
  const base = baseByRole(user?.user_type);
  const [rows, setRows] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(base);
        setRows(data);  
      } catch (e) { console.error(e); }
    };
    load();
  }, [base]);

  const downloadPDF = async () => {
    // lazy-load on click avoids SSR/Node "self is not defined"
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf().set({ filename: "cases_report.pdf", html2canvas: { scale: 2 } }).from(ref.current).save();
  };

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Report</h1>
        <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Download PDF
        </button>
      </div>

      <div ref={ref} className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Cases</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {["ID","Patient","District","Disease","Date"].map((h) => (
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
                <td className="px-3 py-2">{r.date_reported}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="px-3 py-4 text-gray-500" colSpan={5}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
   