import { useState } from "react";
import api from "../api/api";

function PostJob() {

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/jobs", job);

      alert("Job Posted Successfully!");

      console.log(response.data);

      setJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: ""
      });

    } catch (error) {
      alert("Failed to Post Job");
      console.log(error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>

      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          Post Job
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-3"
            type="text"
            name="title"
            placeholder="Job Title"
            value={job.title}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="text"
            name="company"
            placeholder="Company"
            value={job.company}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="text"
            name="salary"
            placeholder="Salary"
            value={job.salary}
            onChange={handleChange}
          />

          <textarea
            className="form-control mb-3"
            name="description"
            placeholder="Job Description"
            rows="4"
            value={job.description}
            onChange={handleChange}
          />

          <button className="btn btn-success w-100">
            Post Job
          </button>

        </form>

      </div>

    </div>
  );
}

export default PostJob;