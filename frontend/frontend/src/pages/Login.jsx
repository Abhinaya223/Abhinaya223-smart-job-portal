import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import confetti from "canvas-confetti";
import { 
  LogIn, 
  Mail, 
  Lock, 
  UserCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Briefcase,
  User
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("JOB_SEEKER"); // "JOB_SEEKER" or "RECRUITER"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTabChange = (role) => {
    setActiveTab(role);
    setErrorMsg("");
    setEmail("");
    setPassword("");
  };

  const handleDemoFill = () => {
    if (activeTab === "RECRUITER") {
      setEmail("recruiter@techcorp.com");
      setPassword("password123");
    } else {
      setEmail("alex@example.com");
      setPassword("password123");
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/auth/login", { email, password });
      
      const data = response.data;
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        const resolvedRole = (data.role === "RECRUITER") ? "RECRUITER" : "JOB_SEEKER";
        const userObj = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: resolvedRole
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

        if (resolvedRole === "RECRUITER") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/jobs");
        }
      } else {
        setErrorMsg("Authentication failed. Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      let msg = "Invalid email or password.";
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
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
      <div 
        className="glass-panel p-4 p-md-5 text-white position-relative overflow-hidden" 
        style={{ maxWidth: "500px", width: "100%", borderRadius: "28px" }}
      >
        
        {/* Glow ambient circle background */}
        <div 
          className="position-absolute top-0 start-50 translate-middle-x"
          style={{
            width: "250px",
            height: "150px",
            background: activeTab === "RECRUITER" ? "rgba(168, 85, 247, 0.2)" : "rgba(6, 182, 212, 0.2)",
            filter: "blur(60px)",
            borderRadius: "50%",
            zIndex: 0
          }}
        ></div>

        <div className="position-relative" style={{ zIndex: 1 }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow-lg"
              style={{ 
                background: activeTab === "RECRUITER" 
                  ? "linear-gradient(135deg, #a855f7, #ec4899)" 
                  : "linear-gradient(135deg, #06b6d4, #3b82f6)" 
              }}
            >
              <LogIn size={28} color="#fff" />
            </div>
            <h2 className="fw-bold text-white mb-1">
              SmartJob<span style={{ color: activeTab === "RECRUITER" ? "#c084fc" : "#06b6d4" }}>Portal</span>
            </h2>
            <p className="text-muted small">Select your role to access your dedicated portal</p>
          </div>

          {/* Distinct Role Tabs */}
          <div className="d-flex glass-panel p-1.5 mb-4" style={{ borderRadius: "16px", background: "rgba(10, 14, 26, 0.7)" }}>
            <button
              type="button"
              className={`btn w-50 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold transition-all ${
                activeTab === "JOB_SEEKER" 
                  ? "gradient-btn-cyan text-white shadow" 
                  : "text-secondary border-0"
              }`}
              style={{ fontSize: "0.85rem" }}
              onClick={() => handleTabChange("JOB_SEEKER")}
            >
              <User size={16} /> Job Seeker
            </button>

            <button
              type="button"
              className={`btn w-50 py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold transition-all ${
                activeTab === "RECRUITER" 
                  ? "gradient-btn-purple text-white shadow" 
                  : "text-secondary border-0"
              }`}
              style={{ fontSize: "0.85rem" }}
              onClick={() => handleTabChange("RECRUITER")}
            >
              <Briefcase size={16} /> Recruiter
            </button>
          </div>

          {errorMsg && (
            <div className="alert alert-danger glass-panel text-white small p-3 mb-4 border-0">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            
            <div className="mb-3">
              <label className="form-label text-secondary small fw-semibold">
                {activeTab === "RECRUITER" ? "Employer Email" : "Candidate Email"}
              </label>
              <div className="position-relative">
                <input
                  type="email"
                  className="glass-input ps-5"
                  placeholder={activeTab === "RECRUITER" ? "recruiter@techcorp.com" : "alex@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} className="text-muted position-absolute top-50 start-0 translate-middle-y ms-3" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small fw-semibold">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="glass-input ps-5 pe-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} className="text-muted position-absolute top-50 start-0 translate-middle-y ms-3" />
                <button
                  type="button"
                  className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-100 py-3 mb-3 ${activeTab === "RECRUITER" ? "gradient-btn-purple gradient-btn" : "gradient-btn-cyan gradient-btn"}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In as {activeTab === "RECRUITER" ? "Recruiter" : "Job Seeker"} <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="text-center text-muted small">
              Don't have an account?{" "}
              <Link to="/register" className="text-cyan text-decoration-none fw-semibold">
                Create Account
              </Link>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Login;