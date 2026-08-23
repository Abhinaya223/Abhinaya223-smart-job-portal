import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Heart, ArrowRight } from "lucide-react";

const footerLinks = {
  "Job Seekers": [
    { label: "Explore Jobs", to: "/jobs" },
    { label: "My Applications", to: "/my-applications" },
    { label: "My Profile", to: "/profile" },
    { label: "Sign In", to: "/seeker-login" },
    { label: "Create Account", to: "/register" },
  ],
  "Employers": [
    { label: "Post a Job", to: "/post-job" },
    { label: "Recruiter Hub", to: "/recruiter-dashboard" },
    { label: "Candidate Pipeline", to: "/recruiter-dashboard" },
    { label: "Recruiter Sign In", to: "/recruiter-login" },
    { label: "Register Company", to: "/register" },
  ],
  "Company": [
    { label: "About Us", to: "/" },
    { label: "Careers at SJP", to: "/" },
    { label: "Blog & Insights", to: "/" },
    { label: "Help Center", to: "/" },
    { label: "Contact Us", to: "/" },
  ],
  "Resources": [
    { label: "Resume Tips", to: "/" },
    { label: "Interview Prep", to: "/" },
    { label: "Salary Guide", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">

          {/* Brand — takes 2 columns */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow">
                <Briefcase size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">SmartJob<span className="text-indigo-400">Portal</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Connecting skilled candidates with leading tech companies worldwide. Find your next opportunity — or hire top talent — all in one place.
            </p>
            <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Browse Open Jobs <ArrowRight size={14} />
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-1">
              <h6 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{title}</h6>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} SmartJobPortal. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400 mx-0.5" /> for modern careers
          </span>
        </div>
      </div>
    </footer>
  );
}