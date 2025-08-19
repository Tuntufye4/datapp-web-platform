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
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>

        <input
          name="username"
          placeholder="Username"
          className="border rounded w-full p-2 mb-3"
          onChange={onChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border rounded w-full p-2 mb-3"
          onChange={onChange}
        />

        <input
          name="first_name"
          placeholder="First Name"
          className="border rounded w-full p-2 mb-3"
          onChange={onChange}
        />

        <input
          name="last_name"
          placeholder="Last Name"
          className="border rounded w-full p-2 mb-3"
          onChange={onChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border rounded w-full p-2 mb-3"
          onChange={onChange}
          required
        />

        <label className="text-sm block mb-1">Role</label>
        <select
          name="role"
          value={form.role}
          className="border rounded w-full p-2 mb-4"
          onChange={onChange}
        >
          <option value="CHW">CHW</option>
          <option value="HSO">HSO</option>
          <option value="CO">CO</option>
        </select>

        {err && <p className="text-red-600 mb-3">{err}</p>}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Register
        </button>

        <p className="text-sm mt-3">
          Have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
