import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import confetti from "canvas-confetti";
import { User, Mail, Lock, Briefcase, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name: "", email: "", password: "", role: "JOB_SEEKER" });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Please fill all fields."); return; }
    setLoading(true); setError("");

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role === "RECRUITER" ? "RECRUITER" : "CANDIDATE"
    };

    try {
      const res = await api.post("/auth/signup", payload);
      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        const userObj = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: form.role === "RECRUITER" ? "RECRUITER" : "JOB_SEEKER"
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
        navigate(form.role === "RECRUITER" ? "/recruiter-dashboard" : "/jobs");
        return;
      }
    } catch (err) {
      console.error("Registration error:", err);
      let msg = "Registration failed. Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          msg = err.response.data;
        } else if (err.response.data.message) {
          msg = err.response.data.message;
        } else if (err.response.data.error) {
          msg = err.response.data.error;
        }
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-slide-up">

          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg mb-4">
              <User size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create Your Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join SmartJobPortal as a candidate or recruiter</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "JOB_SEEKER" })}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                form.role === "JOB_SEEKER"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <User size={20} />
              <span className="text-sm font-semibold">Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "RECRUITER" })}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                form.role === "RECRUITER"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Briefcase size={20} />
              <span className="text-sm font-semibold">Recruiter</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" className="form-input pl-9" placeholder="Alex Rivera" value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" className="form-input pl-9" placeholder="name@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPwd ? "text" : "password"} name="password" className="form-input pl-9 pr-10" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full justify-center py-3.5 mt-2 cursor-pointer ${form.role === "RECRUITER" ? "btn-violet" : "btn-emerald"}`}
              disabled={loading}
            >
              {loading
                ? <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
                : <> Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/seeker-login" className="font-semibold text-indigo-600 hover:text-indigo-800">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}