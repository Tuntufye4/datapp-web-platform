export default function Card({ children, className = "", title }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow p-6 flex flex-col ${className}`}
    >
      {title && <h3 className="text-gray-700 text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
