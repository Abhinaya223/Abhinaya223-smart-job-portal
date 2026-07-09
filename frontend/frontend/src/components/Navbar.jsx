import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#0d6efd",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}
    >
      <h2
        style={{
          color: "white",
          margin: 0,
          fontWeight: "bold"
        }}
      >
        Smart Job Portal
      </h2>

      <div style={{ display: "flex", alignItems: "center" }}>

        <Link to="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/jobs" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          View Jobs
        </Link>

        <Link to="/post-job" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Post Job
        </Link>

        <Link to="/my-applications" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          My Applications
        </Link>

        <Link to="/recruiter-dashboard" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Recruiter Dashboard
        </Link>

        <Link to="/profile" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Profile
        </Link>

        <Link to="/login" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
          Login
        </Link>

        <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
          Register
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;