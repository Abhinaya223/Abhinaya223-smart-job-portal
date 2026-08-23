import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../api/api";
import {
  LayoutDashboard, Users, CheckCircle, XCircle, Clock,
  FileText, Briefcase, UserCheck, RefreshCw, PlusCircle,
  Eye, Download, AlertCircle, X
} from "lucide-react";

const statusConfig = {
  "ACCEPTED":     { cls: "badge-emerald", Icon: CheckCircle },
  "Accepted":     { cls: "badge-emerald", Icon: CheckCircle },
  "REJECTED":     { cls: "badge-red",     Icon: XCircle },
  "Rejected":     { cls: "badge-red",     Icon: XCircle },
  "APPLIED":      { cls: "badge-amber",   Icon: Clock },
  "Applied":      { cls: "badge-amber",   Icon: Clock },
  "UNDER REVIEW": { cls: "badge-indigo",  Icon: Clock },
  "Under Review": { cls: "badge-indigo",  Icon: Clock },
};

export default function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("ALL");
  const [alert, setAlert]               = useState(null);
  const [missingModalFile, setMissingModalFile] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = () => {
    setLoading(true);
    api.get("/applications/recruiter")
      .then(r => { setApplications(r.data || []); setLoading(false); })
      .catch((err) => {
        console.error("Failed to load recruiter applications", err);
        setApplications([]);
        setLoading(false);
      });
  };

  const updateStatus = async (id, actionStatus) => {
    try {
      await api.patch(`/applications/${id}/status`, { status: actionStatus });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: actionStatus } : a));
      showAlert(`Application #${id} updated to ${actionStatus}.`, "success");
    } catch (err) {
      // Fallback endpoint
      try {
        const endpoint = actionStatus === "ACCEPTED" ? "accept" : "reject";
        await api.put(`/applications/${id}/${endpoint}`);
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: actionStatus } : a));
        showAlert(`Application #${id} updated to ${actionStatus}.`, "success");
      } catch (e) {
        showAlert(`Failed to update application #${id}.`, "error");
      }
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Helper to trigger resume view/download
  const handleViewResume = (app, forceDownload = false) => {
    const fileName = app.resumeFileName;
    
    if (!fileName || fileName === "None" || fileName === "undefined") {
      setMissingModalFile(app);
      return;
    }

    const downloadParam = forceDownload ? "?download=true" : "";
    const resumeUrl = `${API_BASE_URL}/applications/${app.id}/resume${downloadParam}`;
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  const filtered  = filter === "ALL" ? applications : applications.filter(a => (a.status || "").toUpperCase() === filter.toUpperCase());
  const total     = applications.length;
  const pending   = applications.filter(a => {
    const s = (a.status || "").toUpperCase();
    return s === "APPLIED" || s === "UNDER REVIEW";
  }).length;
  const accepted  = applications.filter(a => (a.status || "").toUpperCase() === "ACCEPTED").length;
  const rejected  = applications.filter(a => (a.status || "").toUpperCase() === "REJECTED").length;

  const metrics = [
    { label: "Total Applicants",    value: total,    Icon: Users,        color: "bg-indigo-50 text-indigo-600"   },
    { label: "Pending Review",      value: pending,  Icon: Clock,        color: "bg-amber-50 text-amber-600"     },
    { label: "Accepted Candidates", value: accepted, Icon: CheckCircle,  color: "bg-emerald-50 text-emerald-600" },
    { label: "Rejected",            value: rejected, Icon: XCircle,      color: "bg-red-50 text-red-500"         },
  ];

  return (
    <div className="bg-[#F7F8FA] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="glass-pill mb-3 w-fit">
                <LayoutDashboard size={13} /> Employer Control Center
              </div>
              <h1 className="text-4xl font-extrabold text-white">Recruiter Hub</h1>
            </div>
            <div className="flex gap-2">
              <Link to="/post-job" className="btn-primary-sm cursor-pointer">
                <PlusCircle size={14} /> Post New Job
              </Link>
              <button onClick={fetchAll} className="btn-secondary-sm cursor-pointer">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map(({ label, value, Icon, color }) => (
            <div key={label} className="card p-5 text-center">
              <div className={`inline-flex p-3 rounded-xl mb-3 ${color}`}>
                <Icon size={22} />
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {alert && (
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-6 animate-fade-in text-sm font-medium border ${
            alert.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
            alert.type === "info" ? "bg-indigo-50 border-indigo-200 text-indigo-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}>
            {alert.type === "error" ? <AlertCircle size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-emerald-600" />}
            {alert.msg}
          </div>
        )}

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <FileText size={18} className="text-indigo-500" /> Candidate Submissions
          </h2>
          <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1">
            {["ALL", "APPLIED", "ACCEPTED", "REJECTED"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === s ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 w-10 h-10" />
            <p className="text-gray-500 text-sm">Loading candidate submissions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Users size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No applications match this filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map(app => {
              const statusText = app.status || "APPLIED";
              const { cls, Icon } = statusConfig[statusText] || { cls: "badge-amber", Icon: Clock };
              const sUpper = statusText.toUpperCase();
              const isAccepted = sUpper === "ACCEPTED";
              const isRejected = sUpper === "REJECTED";
              const fullFileName = app.resumeFileName || "Candidate_Resume.pdf";
              const candidateName = app.candidateName || app.candidate?.name || `Candidate #${app.candidateId || app.userId || app.candidate?.id || app.id}`;
              const candidateEmail = app.candidateEmail || app.candidate?.email || "";
              const jobTitle = app.jobTitle || app.job?.title || `Job #${app.jobId || app.job?.id}`;

              return (
                <div key={app.id} className="card-hover p-6 flex flex-col gap-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      Application #{app.id}
                    </span>
                    <span className={`${cls} flex items-center gap-1`}>
                      <Icon size={11} /> {statusText}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">Position</div>
                      <div className="font-semibold text-gray-800 flex items-center gap-1 truncate">
                        <Briefcase size={13} className="text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{jobTitle}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-gray-400 text-xs mb-1">Candidate</div>
                      <div className="font-semibold text-gray-800 flex items-center gap-1 truncate">
                        <Users size={13} className="text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{candidateName}</span>
                      </div>
                      {candidateEmail && <div className="text-[11px] text-gray-400 truncate mt-0.5">{candidateEmail}</div>}
                    </div>
                  </div>

                  {/* Resume Row - Fully Clickable & Interactive */}
                  <div className="bg-gray-50 hover:bg-indigo-50/60 border border-gray-100 hover:border-indigo-200 rounded-xl px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between group">
                    <div 
                      className="flex items-center gap-2 text-gray-700 group-hover:text-indigo-700 cursor-pointer flex-1 min-w-0 mr-2"
                      onClick={() => handleViewResume(app, false)}
                      title={fullFileName}
                    >
                      <FileText size={16} className="text-emerald-500 group-hover:text-indigo-600 flex-shrink-0" />
                      <span className="truncate max-w-[180px] sm:max-w-[220px] font-medium group-hover:underline">
                        {fullFileName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="badge-indigo text-xs">PDF</span>
                      
                      {/* View Action Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewResume(app, false); }}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
                        title="View Resume in new tab"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Download Action Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleViewResume(app, true); }}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer"
                        title="Download Resume"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Decision buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => updateStatus(app.id, "ACCEPTED")}
                      disabled={isAccepted}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isAccepted
                          ? "bg-emerald-100 text-emerald-600 cursor-not-allowed"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 cursor-pointer"
                      }`}
                    >
                      <UserCheck size={15} /> {isAccepted ? "Accepted" : "Accept"}
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      disabled={isRejected}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isRejected
                          ? "bg-red-100 text-red-500 cursor-not-allowed"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:scale-105 cursor-pointer"
                      }`}
                    >
                      <XCircle size={15} /> {isRejected ? "Rejected" : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missing File Modal */}
      {missingModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Resume file not available</h3>
            <p className="text-gray-500 text-sm mb-6">
              No valid resume document attached for Application #{missingModalFile.id}.
            </p>
            <button
              onClick={() => setMissingModalFile(null)}
              className="btn-primary-sm w-full justify-center py-2.5 cursor-pointer"
            >
              Okay, Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
}