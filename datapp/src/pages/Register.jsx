import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "CHW", // must match backend 'role' field
  });
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form); // send full payload
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setErr("Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>

        <input
          name="username"
          placeholder="Username"
          className="border border-gray-300 rounded-full w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-full w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
        />

        <input
          name="first_name"
          placeholder="First Name"
          className="border border-gray-300 rounded-full w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          className="border border-gray-300 rounded-full w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-full w-full p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
          required
        />

        <label className="text-sm block mb-1">Role</label>
        <select
          name="role"
          value={form.role}
          className="border border-gray-300 rounded-full w-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={onChange}
        >
          <option value="CHW">CHW</option>
          <option value="HSO">HSO</option>
          <option value="CO">CO</option>
        </select>

        {err && <p className="text-red-600 mb-3">{err}</p>}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full transition-colors">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
    