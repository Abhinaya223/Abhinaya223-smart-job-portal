import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div
        className="text-center text-white py-5"
        
      >
        <h1 className="display-3 fw-bold">
          Welcome to Smart Job Portal
        </h1>

        <p className="lead mt-3">
          Find your dream job and connect with top recruiters.
        </p>

        <div className="mt-4">

          <Link
            to="/jobs"
            className="btn btn-light btn-lg me-3"
          >
            View Jobs
          </Link>

          <Link
            to="/post-job"
            className="btn btn-warning btn-lg"
          >
            Post Job
          </Link>

        </div>
      </div>

      {/* Statistics */}
      <div className="container mt-5">

        <div className="row text-center">

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4">
              <h2>💼 1000+</h2>
              <h5>Jobs Available</h5>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4">
              <h2>🏢 500+</h2>
              <h5>Companies</h5>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-4">
              <h2>👨‍💻 3000+</h2>
              <h5>Job Seekers</h5>
            </div>
          </div>

        </div>

      </div>

      {/* Features */}
      <div className="container mt-5">

        <h2 className="text-center mb-4">
          Why Choose Smart Job Portal?
        </h2>

        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h3>🔍</h3>
                <h5>Smart Job Search</h5>
                <p>Search jobs by title, company, and location quickly.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h3>📄</h3>
                <h5>Easy Applications</h5>
                <p>Apply for jobs with a single click and track your applications.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h3>🚀</h3>
                <h5>Career Growth</h5>
                <p>Connect with recruiters and discover better career opportunities.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;