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
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow-lg">

            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">Post a New Job</h3>
            </div>

            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>

                <div className="row mb-5">
                  <label className="col-sm-3 col-form-label">
                    Job Title
                  </label>

                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={job.title}
                      onChange={handleChange}
                      placeholder="Enter Job Title"
                    />
                  </div>
                </div>

                <div className="row mb-5">
                  <label className="col-sm-3 col-form-label">
                    Company
                  </label>

                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={job.company}
                      onChange={handleChange}
                      placeholder="Enter Company Name"
                    />
                  </div>
                </div>

                <div className="row mb-5">
                  <label className="col-sm-3 col-form-label">
                    Location
                  </label>

                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={job.location}
                      onChange={handleChange}
                      placeholder="Enter Job Location"
                    />
                  </div>
                </div>

                <div className="row mb-5">
                  <label className="col-sm-3 col-form-label">
                    Salary
                  </label>

                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      name="salary"
                      value={job.salary}
                      onChange={handleChange}
                      placeholder="Enter Salary"
                    />
                  </div>
                </div>

                <div className="row mb-5">
                  <label className="col-sm-3 col-form-label">
                    Job Description
                  </label>

                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="5"
                      name="description"
                      value={job.description}
                      onChange={handleChange}
                      placeholder="Enter Job Description"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Post Job
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PostJob;