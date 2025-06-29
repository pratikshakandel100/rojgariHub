import React, { useState } from 'react';
import { Upload, MapPin, Calendar, GraduationCap, Code, Mail, Phone, FileText, X } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    phone: '',
    location: '',
    birthDate: '',
    university: '',
    degree: '',
    graduationYear: '',
    gpa: '',
    skills: [],
    experience: '',
    projects: '',
    resume: null,
  });

  const [skillInput, setSkillInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setProfile(prev => ({ ...prev, resume: file }));
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(prev => ({ ...prev, resume: e.target.files[0] }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.email) newErrors.email = 'Email is required';
    if (!profile.phone) newErrors.phone = 'Phone number is required';
    if (!profile.location) newErrors.location = 'Location is required';
    if (!profile.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!profile.university) newErrors.university = 'University is required';
    if (!profile.degree) newErrors.degree = 'Degree is required';
    if (!profile.graduationYear) newErrors.graduationYear = 'Graduation year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Profile submitted:', profile);
      alert('Profile saved successfully!');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Student Profile</h1>
        <p className="profile-subtitle">Complete your profile to get noticed by top employers</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Contact Information */}
        <div className="profile-card">
          <div className="card-header">
            <Mail className="header-icon" />
            <h2 className="card-title">Contact Information</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <Mail className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                <Phone className="label-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-card">
          <div className="card-header">
            <MapPin className="header-icon" />
            <h2 className="card-title">Personal Information</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <MapPin className="label-icon" />
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`form-input ${errors.location ? 'error' : ''}`}
                placeholder="City, State, Country"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">
                <Calendar className="label-icon" />
                Birth Date
              </label>
              <input
                type="date"
                value={profile.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={`form-input ${errors.birthDate ? 'error' : ''}`}
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="profile-card">
          <div className="card-header">
            <GraduationCap className="header-icon" />
            <h2 className="card-title">Education</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">University/College</label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className={`form-input ${errors.university ? 'error' : ''}`}
                placeholder="University of Example"
              />
              {errors.university && <span className="error-message">{errors.university}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                value={profile.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                className={`form-input ${errors.degree ? 'error' : ''}`}
                placeholder="Bachelor of Science in Computer Science"
              />
              {errors.degree && <span className="error-message">{errors.degree}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Expected Graduation Year</label>
              <input
                type="number"
                value={profile.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                className={`form-input ${errors.graduationYear ? 'error' : ''}`}
                placeholder="2024"
                min="2020"
                max="2030"
              />
              {errors.graduationYear && <span className="error-message">{errors.graduationYear}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">GPA (Optional)</label>
              <input
                type="number"
                step="0.01"
                value={profile.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                className="form-input"
                placeholder="3.75"
                min="0"
                max="4"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="profile-card">
          <div className="card-header">
            <Code className="header-icon" />
            <h2 className="card-title">Skills</h2>
          </div>
          <div className="form-group">
            <div className="skill-input-container">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input skill-input"
                placeholder="Add a skill (e.g., JavaScript, Python, React)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="skill-remove"
                  >
                    <X className="skill-remove-icon" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience & Projects */}
        <div className="profile-card">
          <div className="card-header">
            <FileText className="header-icon" />
            <h2 className="card-title">Experience & Projects</h2>
          </div>
          <div className="form-group">
            <label className="form-label">Work Experience / Internships</label>
            <textarea
              value={profile.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Describe your work experience, internships, or part-time jobs..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Projects</label>
            <textarea
              value={profile.projects}
              onChange={(e) => handleInputChange('projects', e.target.value)}
              className="form-textarea"
              rows={4}
              placeholder="Describe your academic or personal projects..."
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="profile-card">
          <div className="card-header">
            <Upload className="header-icon" />
            <h2 className="card-title">Resume/CV</h2>
          </div>
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {profile.resume ? (
              <div className="uploaded-file">
                <FileText className="file-icon" />
                <div className="file-info">
                  <p className="file-name">{profile.resume.name}</p>
                  <p className="file-size">
                    {(profile.resume.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfile(prev => ({ ...prev, resume: null }))}
                  className="file-remove"
                >
                  <X className="file-remove-icon" />
                </button>
              </div>
            ) : (
              <div className="upload-prompt">
                <Upload className="upload-icon" />
                <p className="upload-title">
                  Drag & drop your resume here
                </p>
                <p className="upload-subtitle">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInput}
                  className="file-input"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="btn-secondary">
                  Choose File
                </label>
                <p className="upload-note">
                  PDF, DOC, or DOCX (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-container">
          <button type="submit" className="btn-primary">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;