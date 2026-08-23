import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { FileText, Briefcase, CheckCircle, Clock, XCircle, Search, ArrowRight, Building2, Eye, Download } from "lucide-react";

const statusConfig = {
  "ACCEPTED":     { cls: "badge-emerald", Icon: CheckCircle },
  "Accepted":     { cls: "badge-emerald", Icon: CheckCircle },
  "REJECTED":     { cls: "badge-red",     Icon: XCircle },
  "Rejected":     { cls: "badge-red",     Icon: XCircle },
  "UNDER REVIEW": { cls: "badge-indigo",  Icon: Clock },
  "Under Review": { cls: "badge-indigo",  Icon: Clock },
  "APPLIED":      { cls: "badge-amber",   Icon: Clock },
  "Applied":      { cls: "badge-amber",   Icon: Clock },
};

const getStatus = (s) => statusConfig[s] || { cls: "badge-amber", Icon: Clock };

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    loadMyApplications();
  }, []);

  const loadMyApplications = () => {
    setLoading(true);
    api.get("/applications/my")
      .then((res) => {
        setApplications(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load applications", err);
        setApplications([]);
        setLoading(false);
      });
  };

  const stepOf = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "ACCEPTED" || s === "REJECTED") return 3;
    if (s === "UNDER REVIEW") return 2;
    return 1;
  };

  const viewResume = (appId) => {
    window.open(`http://localhost:8080/api/applications/${appId}/resume`, "_blank");
  };

  const downloadResume = (appId) => {
    window.open(`http://localhost:8080/api/applications/${appId}/resume?download=true`, "_blank");
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen">

      {/* Header */}
      <div className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="glass-pill mx-auto mb-4 w-fit">
            <FileText size={13} /> Candidate Dashboard
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Applications</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Track real-time status updates on every role you've applied for.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 w-10 h-10" />
            <p className="text-gray-500 text-sm">Retrieving your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-16 text-center">
            <FileText size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No Applications Yet</h3>
            <p className="text-gray-500 text-sm mb-5">Browse open positions and submit your first application!</p>
            <Link to="/jobs" className="btn-primary-sm mx-auto"><Search size={14} /> Explore Jobs</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {applications.map((app) => {
              const statusText  = app.status || "APPLIED";
              const { cls, Icon } = getStatus(statusText);
              const step = stepOf(statusText);
              const jobTitle = app.jobTitle || app.job?.title || `Application #${app.id}`;
              const companyName = app.companyName || app.job?.company || `Job #${app.jobId || app.job?.id}`;

              return (
                <div key={app.id} className="card-hover p-6 flex flex-col gap-4 animate-fade-in">

                  {/* Top row: Job info + status badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {jobTitle}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Building2 size={11} className="text-gray-400" />
                          {companyName}
                        </div>
                      </div>
                    </div>

                    <span className={`${cls} flex-shrink-0 flex items-center gap-1`}>
                      <Icon size={11} />
                      {statusText}
                    </span>
                  </div>

                  {/* Pipeline stepper */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Review Pipeline</p>
                    <div className="flex items-center gap-0">
                      {["Submitted", "In Review", "Decision"].map((label, i) => {
                        const active = step >= i + 1;
                        const isFinal = i === 2;
                        const sUpper = statusText.toUpperCase();
                        const finalColor = sUpper === "ACCEPTED" ? "bg-emerald-500" : sUpper === "REJECTED" ? "bg-red-500" : "bg-indigo-500";
                        return (
                          <React.Fragment key={label}>
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                active ? (isFinal ? finalColor : "bg-indigo-500") + " text-white" : "bg-gray-200 text-gray-400"
                              }`}>
                                {i + 1}
                              </div>
                              <span className={`text-[10px] mt-1 font-medium ${active ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                            </div>
                            {i < 2 && (
                              <div className={`flex-1 h-0.5 mb-4 mx-1 ${step > i + 1 ? "bg-indigo-400" : "bg-gray-200"}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resume row */}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-gray-400 text-xs">Resume:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 text-xs truncate max-w-[150px]">
                        {app.resumeFileName || "Candidate_Resume.pdf"}
                      </span>
                      <button
                        onClick={() => viewResume(app.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        title="View Resume"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => downloadResume(app.id)}
                        className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1 cursor-pointer"
                        title="Download Resume"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-end">
                    <Link to="/jobs" className="btn-secondary-sm">
                      View Jobs <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}