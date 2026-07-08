import { useEffect, useState } from "react";
import axios from "axios";

function ViewJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobs")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

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
      .catch((error) => {
        console.error("Application Error:", error);
        alert("Application Failed!");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="card mb-3 shadow p-3"
          >
            <h3>{job.title}</h3>

            <p><b>Company:</b> {job.company}</p>

            <p><b>Location:</b> {job.location}</p>

            <p><b>Salary:</b> ₹{job.salary}</p>

            <p><b>Description:</b> {job.jobDescription}</p>

            <button
              className="btn btn-success"
              onClick={() => applyJob(job)}
            >
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewJobs;