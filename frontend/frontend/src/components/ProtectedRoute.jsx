import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * @param {string}  redirectTo   - Where to send unauthenticated users
 * @param {string}  requiredRole - "RECRUITER" | "JOB_SEEKER" | null (any logged-in user)
 */
function ProtectedRoute({ children, redirectTo = "/seeker-login", requiredRole = null }) {
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location, toast: "Please log in to continue." }}
        replace
      />
    );
  }

  // ── Logged in but wrong role ───────────────────────────────────────────────
  const isCandidateRole = (role) => role === "JOB_SEEKER" || role === "CANDIDATE" || role === "ROLE_CANDIDATE";
  const isRecruiterRole = (role) => role === "RECRUITER" || role === "ROLE_RECRUITER";

  if (requiredRole === "JOB_SEEKER" && !isCandidateRole(user.role)) {
    return <Navigate to="/" state={{ toast: "This page is only available to candidates." }} replace />;
  }

  if (requiredRole === "RECRUITER" && !isRecruiterRole(user.role)) {
    return <Navigate to="/" state={{ toast: "This page is only available to recruiters." }} replace />;
  }

  return children;
}

export default ProtectedRoute;
