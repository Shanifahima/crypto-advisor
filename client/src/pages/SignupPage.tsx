import React, { useState } from "react";
import Layout from "../components/Layout";
import { signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await signup(form.name, form.email, form.password);
      setAuth(data.token, data.user);
      navigate(data.user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-4">Create Account</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SignupPage;
