import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
}
      