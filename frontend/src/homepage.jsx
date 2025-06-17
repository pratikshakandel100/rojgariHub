import React, { useEffect, useState } from "react";

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs from API (or replace with dummy data)
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-6">
        <h1 className="text-3xl font-bold text-blue-600">RojgariHub</h1>
        <p className="text-gray-600">Find your next opportunity</p>
      </header>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-2xl shadow-md overflow-hidden bg-white hover:shadow-xl transition"
          >
            <img
              src={job.image}
              alt={job.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-gray-500">{job.company} • {job.location}</p>
              <p className="text-green-600 font-medium mt-1">
                ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
              </p>
              <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </main>

      <footer className="bg-white text-center p-4 text-sm text-gray-500">
        © 2025 RojgariHub. All rights reserved.
      </footer>
    </div>
  );
};

export default JobListingPage;
