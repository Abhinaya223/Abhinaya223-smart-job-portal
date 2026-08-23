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
  if (requiredRole && user.role !== requiredRole) {
    const toast =
      requiredRole === "RECRUITER"
        ? "This page is only available to recruiters."
        : "This page is only available to candidates.";

    return <Navigate to="/" state={{ toast }} replace />;
  }

  return children;
}

export default ProtectedRoute;
