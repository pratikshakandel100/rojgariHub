import React, { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { applicationsAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ViewDetails() {
  const navigate = useNavigate();
  const job = {
    id: 'sample-job-id', // This would normally come from props or URL params
    company: 'TESTA',
    title: 'Web & Gameplay Testing – iPhone + Windows Desktop (Kathmandu)',
    location: 'Nepal',
    postedAgo: '6 days ago',
    salary: '$3,600/yr - $4,320/yr',
    type: ['Remote', 'Part-time'],
    description: `Testa is a full-service crowdtesting provider built specifically for the iGaming industry. Our global team of quality testers helps iGaming businesses improve quality and gain valuable insights from real people on the ground. We know the unique challenges gaming companies face and are the key partners to help them deliver top gaming experiences.`,
  };

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [applyingJob, setApplyingJob] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Handle comment submit
  function handleAddComment() {
    if (commentText.trim() === '') return;
    setComments([...comments, commentText.trim()]);
    setCommentText('');
  }

  const handleApply = async () => {
    try {
      setApplyingJob(true);
      await applicationsAPI.apply(job.id);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      const errorData = error.response?.data;
      
      const errorMessage = errorData?.message || error.message || 'Failed to apply to job';
      toast.error(errorMessage);
    } finally {
      setApplyingJob(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Job Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-blue-600">{job.company}</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{job.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {job.location} · {job.postedAgo} · Over 100 people clicked apply
            </p>
          </div>
          <div className="text-2xl text-gray-300">⋮</div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full">
            {job.salary}
          </span>
          {job.type.map((t, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            onClick={handleApply}
            disabled={applyingJob}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applyingJob ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Apply
          </button>
          <button className="border border-blue-600 text-blue-600 font-medium px-5 py-2 rounded-md hover:bg-blue-50 transition">
            Save
          </button>
        </div>
      </div>

      {/* About the Job */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">About the job</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
        <button className="text-blue-600 hover:underline mt-3 text-sm">See more</button>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>
        <div className="space-y-3">
          {/* Comment input */}
          <textarea
            className="w-full border rounded-md p-3 resize-none focus:outline-blue-500"
            rows={3}
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
          >
            Submit
          </button>

          {/* List of comments */}
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-md p-3 bg-gray-50"
              >
                {c}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Resume Required
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Please upload your resume first on your profile before applying for jobs.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    navigate('/profile');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


