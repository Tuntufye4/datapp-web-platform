import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(username, password);
      alert("Login successful!");
    } catch (error) {
      console.error(error);
      setErr("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-4">
        {err && <p className="text-red-600 text-sm mb-4">{err}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-full p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-full p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
