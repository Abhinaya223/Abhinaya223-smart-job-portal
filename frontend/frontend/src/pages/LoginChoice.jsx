import React from "react";
import { Link } from "react-router-dom";
import { User, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginChoice() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl text-center">

        <div className="mb-8">
          <span className="badge-indigo mb-4 inline-flex">SmartJobPortal — Select Portal</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Choose Your Sign In Portal
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Select your account type to access your dedicated dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Candidate */}
          <div className="card p-8 text-center flex flex-col items-center gap-4 border-t-4 border-emerald-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Job Seeker Portal</h3>
              <p className="text-sm text-gray-500">For candidates looking for open positions and tracking their applications.</p>
            </div>
            <Link to="/seeker-login" className="btn-emerald w-full justify-center">
              Sign In as Candidate <ArrowRight size={16} />
            </Link>
          </div>

          {/* Recruiter */}
          <div className="card p-8 text-center flex flex-col items-center gap-4 border-t-4 border-violet-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center shadow-lg">
              <Briefcase size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Employer & Recruiter Hub</h3>
              <p className="text-sm text-gray-500">For hiring managers and recruiters managing job listings and pipelines.</p>
            </div>
            <Link to="/recruiter-login" className="btn-violet w-full justify-center">
              Sign In as Recruiter <ArrowRight size={16} />
            </Link>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <ShieldCheck size={15} className="text-emerald-500" />
          Secured with Spring Boot REST Authentication
        </div>
      </div>
    </div>
  );
}
