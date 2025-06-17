import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="rounded-2xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition"
        >
          <img
            src={job.image}
            alt={job.title}
            className="h-48 w-full object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">
              {job.company} • {job.location}
            </p>
            <p className="text-green-600 font-medium mt-1">
              ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
