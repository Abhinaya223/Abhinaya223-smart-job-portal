import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SeekerLogin from "./pages/SeekerLogin";
import RecruiterLogin from "./pages/RecruiterLogin";
import LoginChoice from "./pages/LoginChoice";
import Register from "./pages/Register";
import ViewJobs from "./pages/ViewJobs";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ── Public routes ──────────────────────────────────────────── */}
        <Route path="/"                element={<Home />}           />
        <Route path="/seeker-login"    element={<SeekerLogin />}    />
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/login"           element={<LoginChoice />}    />
        <Route path="/register"        element={<Register />}       />
        <Route path="/jobs"            element={<ViewJobs />}       />
        <Route path="/profile"         element={<Profile />}        />

        {/* ── Candidate-only ──────────────────────────────────────────
            Unauthenticated → /seeker-login with toast
            Wrong role (Recruiter) → / with toast                    */}
        <Route path="/my-applications" element={
          <ProtectedRoute redirectTo="/seeker-login" requiredRole="JOB_SEEKER">
            <MyApplications />
          </ProtectedRoute>
        } />

        {/* ── Recruiter-only ──────────────────────────────────────────
            Unauthenticated → /recruiter-login with toast
            Wrong role (Candidate) → / with toast                    */}
        <Route path="/post-job" element={
          <ProtectedRoute redirectTo="/recruiter-login" requiredRole="RECRUITER">
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/recruiter-dashboard" element={
          <ProtectedRoute redirectTo="/recruiter-login" requiredRole="RECRUITER">
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;