import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5">

      <div className="text-center p-5 bg-light rounded shadow">
        <h1 className="display-4 fw-bold text-primary">
          Smart Job Portal
        </h1>

        <p className="lead">
          Find your dream job with AI-powered recommendations.
        </p>

        <div className="mt-4">
          <Link to="/login" className="btn btn-primary btn-lg me-3">
            Login
          </Link>

          <Link to="/register" className="btn btn-success btn-lg">
            Register
          </Link>
        </div>

      </div>

      <div className="row mt-5">

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h3>💼 1000+</h3>
              <p>Jobs Available</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h3>👨‍💼 500+</h3>
              <p>Recruiters</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h3>🎯 3000+</h3>
              <p>Job Seekers</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;