import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import confetti from "canvas-confetti";
import { Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, User, AlertCircle } from "lucide-react";

export default function RecruiterLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail]       = useState("recruiter@techcorp.com");
  const [password, setPassword] = useState("password123");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState(location.state?.toast || "");

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(""), 4000); return () => clearTimeout(t); }
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        const userObj = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: "RECRUITER"
        };
        localStorage.setItem("user", JSON.stringify(userObj));
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        navigate("/recruiter-dashboard");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      let msg = "Invalid email or password";
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

        {toast && (
          <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium px-4 py-3 rounded-xl animate-fade-in">
            <AlertCircle size={16} /> {toast}
          </div>
        )}

        <div className="card p-8 animate-slide-up">

          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg mb-4">
              <Briefcase size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Recruiter Sign In</h1>
            <p className="text-gray-500 text-sm mt-1">Access your employer dashboard and candidate pipeline</p>
          </div>

          <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-violet-700 text-sm font-semibold">
              <CheckCircle2 size={15} /> Demo recruiter account ready
            </div>
            <button
              type="button"
              className="text-xs font-bold text-violet-700 hover:text-violet-900 bg-violet-100 hover:bg-violet-200 px-3 py-1 rounded-full transition-colors"
              onClick={() => { setEmail("recruiter@techcorp.com"); setPassword("password123"); }}
            >
              Auto Fill
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Employer Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" className="form-input pl-9" placeholder="recruiter@techcorp.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPwd ? "text" : "password"} className="form-input pl-9 pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-violet w-full justify-center py-3.5 mt-2 cursor-pointer" disabled={loading}>
              {loading ? <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" /> : <><Briefcase size={16} /> Sign In as Recruiter <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-sm">
            <Link to="/seeker-login" className="flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">
              <User size={13} /> Candidate Login →
            </Link>
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
