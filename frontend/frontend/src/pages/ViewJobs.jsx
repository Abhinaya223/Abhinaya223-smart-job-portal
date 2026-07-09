import { useEffect, useState } from "react";
import axios from "axios";

function ViewJobs() {

  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    axios
      .get("http://localhost:8080/api/jobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchJobs = () => {

    let url = "http://localhost:8080/api/jobs";

    if (title !== "") {
      url = `http://localhost:8080/api/jobs/search/title?title=${title}`;
    } else if (company !== "") {
      url = `http://localhost:8080/api/jobs/search/company?company=${company}`;
    } else if (location !== "") {
      url = `http://localhost:8080/api/jobs/search/location?location=${location}`;
    }

    axios
      .get(url)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const applyJob = (job) => {

    const application = {
      userId: 1,
      jobId: job.id,
      status: "Applied",
      resumeFileName: ""
    };

    axios
      .post("http://localhost:8080/api/applications", application)
      .then(() => {
        alert("Applied Successfully!");
      })
      .catch(() => {
        alert("Application Failed!");
      });
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center text-primary mb-4">
        Available Jobs
      </h2>

      <div className="row mb-4">

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            onClick={searchJobs}
          >
            Search
          </button>
        </div>

      </div>

      <div className="row">

        {jobs.map((job) => (

          <div className="col-md-6 mb-4" key={job.id}>

            <div className="card shadow h-100">

              <div className="card-body">

                <h4 className="text-primary">{job.title}</h4>

                <hr />

                <p><strong>🏢 Company:</strong> {job.company}</p>

                <p><strong>📍 Location:</strong> {job.location}</p>

                <p><strong>💰 Salary:</strong> ₹{job.salary}</p>

                <p>
                  <strong>📝 Description:</strong><br />
                  {job.description}
                </p>

              </div>

              <div className="card-footer bg-white border-0">

                <button
                  className="btn btn-success w-100"
                  onClick={() => applyJob(job)}
                >
                  Apply Now
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ViewJobs;