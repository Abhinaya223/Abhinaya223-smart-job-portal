import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase, Search, FileText, LayoutDashboard,
  LogOut, UserPlus, Sparkles, PlusCircle, User, Menu, X
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [user, setUser]           = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  // Re-read user on every route change
  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("user") || "null")); }
    catch { setUser(null); }
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // ── Role helpers ────────────────────────────────────────────────────────────
  const isRecruiter = user?.role === "RECRUITER";
  const isCandidate = user?.role === "JOB_SEEKER";
  const isGuest     = !user;

  // ── Nav link builder ────────────────────────────────────────────────────────
  const NavLink = ({ to, label, Icon }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive(to)
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={15} />
      {label}
    </Link>
  );

  // ── Which nav items to show ──────────────────────────────────────────────────
  // Home and View Jobs are always visible
  // My Applications → candidates + guests only
  // Post Job + Recruiter Hub → recruiters + guests only
  const showMyApplications = isGuest || isCandidate;
  const showRecruiterLinks  = isGuest || isRecruiter;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100" : "bg-white border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-md group-hover:shadow-indigo-300 transition-shadow">
              <Briefcase size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-lg text-gray-900">SmartJob<span className="text-indigo-600">Portal</span></span>
            </div>
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Always visible */}
            <NavLink to="/"     label="Home"      Icon={Sparkles} />
            <NavLink to="/jobs" label="View Jobs"  Icon={Search}   />

            {/* Candidate-only */}
            {showMyApplications && (
              <NavLink to="/my-applications" label="My Applications" Icon={FileText} />
            )}

            {/* Recruiter-only */}
            {showRecruiterLinks && (
              <>
                <NavLink to="/post-job"            label="Post Job"     Icon={PlusCircle}      />
                <NavLink to="/recruiter-dashboard" label="Recruiter Hub" Icon={LayoutDashboard} />
              </>
            )}
          </div>

          {/* ── Auth area ───────────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                {/* User chip with role badge */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isRecruiter
                      ? "bg-violet-100 text-violet-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {isRecruiter ? "Recruiter" : "Candidate"}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/seeker-login"    className="btn-emerald-sm"><User size={14} /> Job Seeker</Link>
                <Link to="/recruiter-login" className="btn-violet-sm"><Briefcase size={14} /> Recruiter</Link>
                <Link to="/register"        className="btn-primary-sm"><UserPlus size={14} /> Sign Up</Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ────────────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2 animate-fade-in">
          <NavLink to="/"     label="Home"      Icon={Sparkles} />
          <NavLink to="/jobs" label="View Jobs"  Icon={Search}   />

          {showMyApplications && (
            <NavLink to="/my-applications" label="My Applications" Icon={FileText} />
          )}
          {showRecruiterLinks && (
            <>
              <NavLink to="/post-job"            label="Post Job"     Icon={PlusCircle}      />
              <NavLink to="/recruiter-dashboard" label="Recruiter Hub" Icon={LayoutDashboard} />
            </>
          )}

          <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-2">
            {user ? (
              <button onClick={logout} className="btn-danger-sm w-full justify-center">
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <>
                <Link to="/seeker-login"    onClick={() => setMobileOpen(false)} className="btn-emerald-sm justify-center">Job Seeker Login</Link>
                <Link to="/recruiter-login" onClick={() => setMobileOpen(false)} className="btn-violet-sm  justify-center">Recruiter Login</Link>
                <Link to="/register"        onClick={() => setMobileOpen(false)} className="btn-primary-sm  justify-center">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}