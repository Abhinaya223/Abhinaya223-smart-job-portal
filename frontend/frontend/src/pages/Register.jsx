import { useState } from "react";
import api from "../api/api";

function Register() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOB_SEEKER"
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/users/register", user);

      alert("Registration Successful!");

      console.log(response.data);

      setUser({
        name: "",
        email: "",
        password: "",
        role: "JOB_SEEKER"
      });

    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          Register
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            className="form-control mb-3"
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />

          <select
            className="form-control mb-3"
            name="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="RECRUITER">Recruiter</option>
          </select>

          <button className="btn btn-primary w-100">
            Register
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;