import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search, PlusCircle, Briefcase, Building2, Users, Zap,
  ArrowRight, CheckCircle2, User, Star, TrendingUp, AlertCircle, X
} from "lucide-react";

const stats = [
  { value: "500+",    label: "Active Job Positions",     Icon: Briefcase,   color: "bg-indigo-50 text-indigo-600" },
  { value: "120+",    label: "Enterprise Companies",      Icon: Building2,   color: "bg-sky-50 text-sky-600" },
  { value: "10,000+", label: "Verified Applicants",       Icon: Users,       color: "bg-violet-50 text-violet-600" },
  { value: "95%",     label: "Successful Placement Rate", Icon: TrendingUp,  color: "bg-emerald-50 text-emerald-600" },
];

export default function Home() {
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.toast || "");

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="bg-[#F7F8FA]">
      {/* Role-redirect toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-amber-50 border border-amber-300 text-amber-900 text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
          {toast}
          <button onClick={() => setToast("")} className="ml-2 text-amber-500 hover:text-amber-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center animate-fade-in">
          <div className="glass-pill mx-auto mb-6 w-fit">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            SmartJobPortal — Find Your Next Big Opportunity
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Accelerate Your Career with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              Top-Tier Tech Companies
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            The modern job matching platform for engineers, designers, and recruiters — instant applications, live status tracking, and 1-click hiring decisions.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/jobs" className="btn-primary text-base px-8 py-3.5">
              <Search size={18} /> Explore Jobs <ArrowRight size={16} />
            </Link>
            <Link to="/seeker-login" className="btn-emerald text-base px-8 py-3.5">
              <User size={18} /> Candidate Sign In
            </Link>
            <Link to="/recruiter-login" className="btn-violet text-base px-8 py-3.5">
              <Briefcase size={18} /> Recruiter Sign In
            </Link>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-gray-500 text-sm mr-1 self-center font-medium">Popular:</span>
            {["Full-Stack", "AI Engineering", "Spring Boot", "Cloud DevOps", "UI/UX Design", "Backend"].map((tag) => (
              <Link
                key={tag}
                to={`/jobs?search=${encodeURIComponent(tag)}`}
                className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium hover:bg-white/20 hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, Icon, color }) => (
            <div key={label} className="card p-6 text-center animate-slide-up">
              <div className={`inline-flex p-3 rounded-xl mb-3 ${color}`}>
                <Icon size={24} />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dual Portal Pathways ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="section-badge mx-auto">
            <Users size={14} /> Tailored for Everyone
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Two Dedicated Portals
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Separate sign-in screens and purpose-built workflows for job seekers and hiring managers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Candidate Portal */}
          <div className="card-hover p-8 border-t-4 border-emerald-500">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
              <User size={28} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Seeker Portal</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Discover thousands of verified tech positions. Apply with a resume upload, track application status in real time, and get instant recruiter feedback.
            </p>
            <ul className="space-y-2 mb-8">
              {["Dedicated candidate sign-in screen", "Multi-field job search & filters", "Live application pipeline tracker"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link to="/seeker-login" className="btn-emerald-sm flex-1 justify-center">Sign In as Candidate</Link>
              <Link to="/jobs" className="btn-secondary-sm flex-1 justify-center">Browse Jobs</Link>
            </div>
          </div>

          {/* Recruiter Portal */}
          <div className="card-hover p-8 border-t-4 border-violet-500">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-5">
              <Briefcase size={28} className="text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Recruiter & Employer Hub</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Post jobs with a live preview card, manage your candidate pipeline, and make accept/reject decisions in one click.
            </p>
            <ul className="space-y-2 mb-8">
              {["Dedicated recruiter sign-in screen", "Job studio with live card preview", "1-Click Accept / Reject decisions"].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-violet-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <Link to="/recruiter-login" className="btn-violet-sm flex-1 justify-center">Sign In as Recruiter</Link>
              <Link to="/post-job" className="btn-secondary-sm flex-1 justify-center">Post a Job</Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────────── */}
      <section className="bg-indigo-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to land your next role?</h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
            Join thousands of engineers who found their dream job through SmartJobPortal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 hover:scale-105 transition-all duration-200 shadow-lg">
              Create Free Account
            </Link>
            <Link to="/jobs" className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-200">
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}