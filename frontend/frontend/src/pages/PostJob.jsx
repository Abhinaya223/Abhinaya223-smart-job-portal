import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import confetti from "canvas-confetti";
import { PlusCircle, Briefcase, Building2, MapPin, DollarSign, FileText, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function PostJob() {
  const navigate = useNavigate();
  const [job, setJob] = useState({ title: "", company: "", location: "", salary: "", jobType: "Full-Time", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handle = (e) => setJob({ ...job, [e.target.name]: e.target.value });
  const setPreset = (v) => setJob({ ...job, salary: v });

  const isPlaceholder = (val) => !val || val.trim() === "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job.title || !job.company || !job.location || !job.description) {
      setAlert({ type: "warn", msg: "Please fill out all required fields." }); return;
    }
    setSubmitting(true);
    setAlert(null);

    try {
      await api.post("/jobs", { ...job, salary: parseFloat(job.salary) || 0 });
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      setAlert({ type: "ok", msg: `"${job.title}" published successfully!` });
      setJob({ title: "", company: "", location: "", salary: "", jobType: "Full-Time", description: "" });
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (err) {
      const msg = err.response?.data || "Failed to publish job.";
      setAlert({ type: "error", msg: typeof msg === "string" ? msg : "Job publishing failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-sm font-semibold mb-4">
            <PlusCircle size={14} /> Employer Publishing Studio
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Post a New Position</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Publish open roles to thousands of qualified candidates instantly.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {alert && (
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6 animate-fade-in border ${
            alert.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
            alert.type === "warn" ? "bg-amber-50 border-amber-200 text-amber-800" :
            "bg-red-50 border-red-200 text-red-800"
          }`}>
            {alert.type === "ok" ? <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" /> : <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />}
            <span className="font-medium text-sm">{alert.msg}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3 card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <PlusCircle size={20} className="text-indigo-600" /> Position Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="form-label">Job Title *</label>
                <input type="text" name="title" className="form-input" placeholder="e.g. Senior Software Engineer" value={job.title} onChange={handle} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Company Name *</label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="company" className="form-input pl-8" placeholder="e.g. TechCorp Inc." value={job.company} onChange={handle} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Location *</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" name="location" className="form-input pl-8" placeholder="Remote / New York" value={job.location} onChange={handle} required />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="form-label mb-0">Annual Salary (USD)</label>
                    <div className="flex gap-1.5">
                      {[110000, 140000, 175000].map(v => (
                        <button key={v} type="button" onClick={() => setPreset(v.toString())}
                          className="text-xs px-2 py-0.5 rounded-full border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors cursor-pointer">
                          ${v / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="salary" className="form-input pl-8" placeholder="e.g. 140000" value={job.salary} onChange={handle} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Job Type</label>
                  <select name="jobType" className="form-input" value={job.jobType} onChange={handle}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Job Description & Requirements *</label>
                <textarea name="description" rows={5} className="form-input resize-none" placeholder="Describe key responsibilities, required tech stack, benefits..." value={job.description} onChange={handle} required />
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3.5 cursor-pointer" disabled={submitting}>
                {submitting
                  ? <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
                  : <><PlusCircle size={16} /> Publish Job Listing <ArrowRight size={15} /></>}
              </button>
            </form>
          </div>

          {/* Live Preview — 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
              <div className="card p-6 border-t-4 border-indigo-500">

                <div className="mb-1">
                  <span className="badge-indigo mb-2">{job.jobType || "Full-Time"}</span>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${isPlaceholder(job.title) ? "text-gray-300 italic" : "text-gray-900"}`}>
                  {isPlaceholder(job.title) ? "Job Title" : job.title}
                </h3>

                <div className="flex flex-wrap gap-3 text-xs mb-3">
                  <span className={`flex items-center gap-1 ${isPlaceholder(job.company) ? "text-gray-300 italic" : "text-gray-500"}`}>
                    <Building2 size={12} className={isPlaceholder(job.company) ? "text-gray-300" : "text-indigo-400"} />
                    {isPlaceholder(job.company) ? "Company Name" : job.company}
                  </span>
                  <span className={`flex items-center gap-1 ${isPlaceholder(job.location) ? "text-gray-300 italic" : "text-gray-500"}`}>
                    <MapPin size={12} className={isPlaceholder(job.location) ? "text-gray-300" : "text-indigo-400"} />
                    {isPlaceholder(job.location) ? "Location" : job.location}
                  </span>
                </div>

                <div className={`text-xl font-extrabold mb-3 ${!job.salary ? "text-gray-300 italic text-base" : "text-emerald-600"}`}>
                  {!job.salary ? "Salary not specified" : `$${parseFloat(job.salary || 0).toLocaleString()} / yr`}
                </div>

                <p className={`text-sm leading-relaxed mb-4 ${isPlaceholder(job.description) ? "text-gray-300 italic" : "text-gray-500"}`}>
                  {isPlaceholder(job.description) ? "Your job description will appear here as you type on the left..." : job.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button className="btn-primary-sm opacity-60 cursor-default" disabled>Apply Now</button>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">This is how candidates will see your listing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}