import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import confetti from "canvas-confetti";
import {
  Search, Building2, MapPin, DollarSign, FileText,
  CheckCircle, Upload, X, Briefcase, ArrowRight, Filter, AlertCircle
} from "lucide-react";

export default function ViewJobs() {
  const location                = useLocation();
  const navigate                = useNavigate();
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [title, setTitle]       = useState("");
  const [company, setCompany]   = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile]   = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [applied, setApplied]         = useState(new Set());
  const [alert, setAlert]             = useState(null);
  const [modalError, setModalError]   = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    if (q) {
      setTitle(q);
      searchJobs(q, "", "");
    } else {
      loadAll();
    }
  }, [location.search]);

  const loadAll = () => {
    setLoading(true);
    api.get("/jobs")
      .then(r => { setJobs(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const searchJobs = (t, c, l) => {
    setLoading(true);
    let url = "/jobs";
    if (t) url = `/jobs/search/title?title=${encodeURIComponent(t)}`;
    else if (c) url = `/jobs/search/company?company=${encodeURIComponent(c)}`;
    else if (l) url = `/jobs/search/location?location=${encodeURIComponent(l)}`;
    api.get(url)
      .then(r => { setJobs(r.data || []); setLoading(false); })
      .catch(() => { loadAll(); });
  };

  const handleSearch = (e) => { e.preventDefault(); searchJobs(title, company, locationInput); };
  const reset = () => { setTitle(""); setCompany(""); setLocationInput(""); loadAll(); };

  const handleApplyClick = (job) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/seeker-login", { state: { toast: "Please log in as a candidate to apply for jobs." } });
      return;
    }
    try {
      const u = JSON.parse(userStr);
      if (u.role === "RECRUITER") {
        setAlert({ type: "warn", msg: "Recruiter accounts cannot apply for jobs. Please log in as a Candidate." });
        return;
      }
    } catch (e) {
      navigate("/seeker-login", { state: { toast: "Please log in as a candidate to apply for jobs." } });
      return;
    }
    setSelectedJob(job);
    setModalError("");
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setUploading(true);
    setModalError("");

    try {
      if (resumeFile) {
        const fd = new FormData();
        fd.append("jobId", selectedJob.id);
        fd.append("file", resumeFile);
        await api.post("/applications", fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/applications", { jobId: selectedJob.id, resumeFileName: "Candidate_Resume.pdf" });
      }
      finishApply();
    } catch (err) {
      const msg = err.response?.data || "Application submission failed.";
      setModalError(typeof msg === "string" ? msg : "Failed to submit application.");
    } finally {
      setUploading(false);
    }
  };

  const finishApply = () => {
    setUploading(false);
    setApplied(prev => new Set(prev).add(selectedJob.id));
    setAlert({ type: "ok", msg: `Application submitted for "${selectedJob.title}" at ${selectedJob.company}!` });
    setSelectedJob(null);
    setResumeFile(null);
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="glass-pill mx-auto mb-4 w-fit">
            <Search size={13} /> Live Job Listings
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Explore Open Positions</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Search across software engineering, AI, design, and enterprise architecture roles.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Alert */}
        {alert && (
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6 animate-fade-in border ${
            alert.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            {alert.type === "ok" ? <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" /> : <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />}
            <span className="font-medium text-sm">{alert.msg}</span>
            <button className="ml-auto text-gray-500 hover:text-gray-700" onClick={() => setAlert(null)}><X size={15} /></button>
          </div>
        )}

        {/* Search bar */}
        <div className="card p-5 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="form-input pl-8 text-sm" placeholder="Job title or keyword" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="form-input pl-8 text-sm" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="form-input pl-8 text-sm" placeholder="City or Remote" value={locationInput} onChange={e => setLocationInput(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary-sm flex-1 justify-center cursor-pointer">
                  <Search size={14} /> Search
                </button>
                {(title || company || locationInput) && (
                  <button type="button" onClick={reset} className="btn-secondary-sm px-3 cursor-pointer">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 w-10 h-10" />
            <p className="text-gray-500 text-sm">Loading open positions...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card p-16 text-center">
            <Briefcase size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Jobs Found</h3>
            <p className="text-gray-500 text-sm mb-5">Try different search terms or reset filters.</p>
            <button onClick={reset} className="btn-primary-sm mx-auto cursor-pointer">Reset Search</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4 font-medium">{jobs.length} positions found</p>
            <div className="grid md:grid-cols-2 gap-5">
              {jobs.map(job => {
                const hasApplied = applied.has(job.id);
                return (
                  <div key={job.id} className="card-hover p-6 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="badge-indigo mb-2">{job.jobType || "Full-Time"}</span>
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-extrabold text-emerald-600">
                            ${job.salary ? Number(job.salary).toLocaleString() : "N/A"}
                          </div>
                          <div className="text-xs text-gray-400">per year</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><Building2 size={12} className="text-indigo-400" />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-indigo-400" />{job.location}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{job.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-mono">ID #{job.id}</span>
                      {hasApplied ? (
                        <span className="badge-emerald"><CheckCircle size={12} /> Applied</span>
                      ) : (
                        <button className="btn-primary-sm cursor-pointer" onClick={() => handleApplyClick(job)}>
                          Apply Now <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 animate-slide-up">

            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow">
                  <Briefcase size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-xs text-gray-500">{selectedJob.company} · {selectedJob.location}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedJob(null); setResumeFile(null); setModalError(""); }} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                <AlertCircle size={15} /> {modalError}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-5 flex gap-6 text-sm">
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Annual Salary</div>
                <div className="font-bold text-emerald-600">${selectedJob.salary ? Number(selectedJob.salary).toLocaleString() : "N/A"}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-0.5">Job Type</div>
                <div className="font-semibold text-gray-700">{selectedJob.jobType || "Full-Time"}</div>
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label mb-2">Attach Resume (PDF only, max 5MB)</label>
              <label
                htmlFor="resumeInput"
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                  resumeFile ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {resumeFile ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                    <FileText size={18} className="text-emerald-500" />
                    {resumeFile.name}
                    <button type="button" className="text-red-400 hover:text-red-600 ml-2" onClick={(e) => { e.preventDefault(); setResumeFile(null); }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to upload resume</span>
                    <span className="text-xs text-gray-400 mt-1">PDF file only (max 5MB)</span>
                  </>
                )}
              </label>
              <input id="resumeInput" type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && setResumeFile(e.target.files[0])} />
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1 justify-center cursor-pointer" onClick={() => { setSelectedJob(null); setResumeFile(null); setModalError(""); }}>Cancel</button>
              <button className="btn-primary flex-1 justify-center cursor-pointer" onClick={submitApplication} disabled={uploading}>
                {uploading ? <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" /> : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}