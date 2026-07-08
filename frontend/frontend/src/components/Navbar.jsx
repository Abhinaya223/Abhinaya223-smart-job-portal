import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#0d6efd",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "white", margin: 0 }}>Smart Job Portal</h2>

      <div>
        <Link
          to="/"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Home
        </Link>

        <Link
          to="/jobs"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          View Jobs
        </Link>

        <Link
          to="/login"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Register
        </Link>

        <Link
          to="/post-job"
          style={{ color: "white", "margin-right":"20px", textDecoration: "none" }}
        >
          Post Job
        </Link>

        <Link
          to="/my-applications"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          My Applications
        </Link>

        <Link
          to="/recruiter-dashboard"
          style={{ color: "white", marginRight: "20px", textDecoration: "none" }}
        >
          Recruiter Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;