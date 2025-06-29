import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Menu, 
  Filter, 
  X, 
  ChevronDown, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Grid, 
  List, 
  SortAsc, 
  Bookmark, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Heart
} from 'lucide-react';

// Header Component
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-container">
            <span className="logo-text">RojgariHub</span>
          </div>

          {/* EmployeeZone Button */}
          <button className="employee-zone-btn">
            EmployeeZone
          </button>
        </div>
      </div>
    </header>
  );
};

// Search Filters Component
const SearchFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    salary: [],
    location: []
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
  const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
  const salaryRanges = ['$30k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k+'];
  const locations = ['New York', 'San Francisco', 'London', 'Toronto', 'Remote'];

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experience: [],
      salary: [],
      location: []
    });
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  return (
    <div className="search-filters">
      <div className="search-container">
        {/* Main Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="location-input-container">
            <MapPin className="location-icon" />
            <input
              type="text"
              placeholder="City, state, or remote"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="location-input"
            />
          </div>
          <button className="search-btn">
            Search Jobs
          </button>
        </div>

        {/* Filter Toggle and Active Filters */}
        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            <Filter className="filter-icon" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="filter-count">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`chevron-icon ${showFilters ? 'rotated' : ''}`} />
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="clear-filters"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              {/* Job Type Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <Briefcase className="filter-title-icon" />
                  Job Type
                </h3>
                <div className="filter-options">
                  {jobTypes.map(type => (
                    <label key={type} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => toggleFilter('jobType', type)}
                        className="filter-checkbox"
                      />
                      <span className="filter-label">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <Clock className="filter-title-icon" />
                  Experience
                </h3>
                <div className="filter-options">
                  {experienceLevels.map(level => (
                    <label key={level} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.experience.includes(level)}
                        onChange={() => toggleFilter('experience', level)}
                        className="filter-checkbox"
                      />
                      <span className="filter-label">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <DollarSign className="filter-title-icon" />
                  Salary Range
                </h3>
                <div className="filter-options">
                  {salaryRanges.map(range => (
                    <label key={range} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.salary.includes(range)}
                        onChange={() => toggleFilter('salary', range)}
                        className="filter-checkbox"
                      />
                      <span className="filter-label">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="filter-section">
                <h3 className="filter-title">
                  <MapPin className="filter-title-icon" />
                  Location
                </h3>
                <div className="filter-options">
                  {locations.map(location => (
                    <label key={location} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={() => toggleFilter('location', location)}
                        className="filter-checkbox"
                      />
                      <span className="filter-label">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job }) => {
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className={`job-card ${job.featured ? 'featured' : ''}`}>
      {job.featured && (
        <div className="featured-badge">
          Featured Job
        </div>
      )}
      
      <div className="job-card-content">
        {/* Header */}
        <div className="job-header">
          <div className="job-info">
            <div className="company-logo">
              {job.logo ? (
                <img src={job.logo} alt={job.company} className="logo-img" />
              ) : (
                <Building2 className="logo-icon" />
              )}
            </div>
            <div className="job-details">
              <h3 className="job-title">
                {job.title}
              </h3>
              <p className="company-name">{job.company}</p>
              <div className="job-meta">
                <div className="meta-item">
                  <MapPin className="meta-icon" />
                  <span className="meta-text">{job.location}</span>
                </div>
                <div className="meta-item">
                  <Clock className="meta-icon" />
                  <span className="meta-text">{job.type}</span>
                </div>
                <div className="meta-item">
                  <DollarSign className="meta-icon" />
                  <span className="salary-text">{job.salary}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="bookmark-btn">
            <Bookmark className="bookmark-icon" />
          </button>
        </div>

        {/* Description */}
        <p className="job-description">
          {job.description}
        </p>

        {/* Requirements */}
        <div className="requirements">
          <div className="requirement-tags">
            {job.requirements.slice(0, 4).map((req, index) => (
              <span key={index} className="requirement-tag">
                {req}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="requirement-tag more">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="job-footer">
          <span className="posted-date">
            {timeAgo(job.postedDate)}
          </span>
          <div className="job-actions">
            <button className="view-details-btn">
              View Details
            </button>
            <button className="apply-btn">
              Apply Now
              <ExternalLink className="apply-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Job List Component
const JobList = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Mock job data
  const jobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for developing and maintaining web applications using React, TypeScript, and modern development practices.',
      requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Jest'],
      postedDate: '2024-01-15',
      featured: true
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$100k - $140k',
      description: 'Join our product team to drive the development of innovative solutions. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Roadmapping'],
      postedDate: '2024-01-14'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignStudio',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $110k',
      description: 'We are seeking a talented UX/UI designer to create beautiful and intuitive user interfaces. You will be responsible for the entire design process from research to final implementation.',
      requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
      postedDate: '2024-01-13'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$110k - $150k',
      description: 'Looking for a DevOps engineer to help scale our infrastructure and improve our deployment processes. Experience with cloud platforms and containerization is essential.',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Python'],
      postedDate: '2024-01-12'
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'DataCorp',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Join our data science team to build machine learning models and extract insights from large datasets. You will work on challenging problems across various domains.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics', 'R'],
      postedDate: '2024-01-11',
      featured: true
    },
    {
      id: '6',
      title: 'Frontend Developer',
      company: 'WebAgency',
      location: 'Los Angeles, CA',
      type: 'Part-time',
      salary: '$60k - $80k',
      description: 'We need a skilled frontend developer to create responsive and interactive web applications. Experience with modern JavaScript frameworks is required.',
      requirements: ['JavaScript', 'Vue.js', 'CSS3', 'HTML5', 'Webpack', 'SASS'],
      postedDate: '2024-01-10'
    }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' },
    { value: 'company', label: 'Company A-Z' }
  ];

  return (
    <div className="job-list">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h1 className="results-title">
            {jobs.length} Jobs Found
          </h1>
          <p className="results-subtitle">
            Discover your next career opportunity
          </p>
        </div>
        
        <div className="results-controls">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid className="view-icon" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List className="view-icon" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="sort-chevron" />
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className={`jobs-grid ${viewMode}`}>
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="load-more">
        <button className="load-more-btn">
          Load More Jobs
        </button>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Building2 className="footer-icon" />
              </div>
              <span className="footer-logo-text">RojgariHub</span>
            </div>
            <p className="footer-description">
              Connecting talented professionals with their dream careers. Your success is our mission.
            </p>
            <div className="social-links">
              <a href="#" className="social-link facebook">
                <Facebook className="social-icon" />
              </a>
              <a href="#" className="social-link twitter">
                <Twitter className="social-icon" />
              </a>
              <a href="#" className="social-link linkedin">
                <Linkedin className="social-icon" />
              </a>
              <a href="#" className="social-link instagram">
                <Instagram className="social-icon" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div className="footer-section">
            <h3 className="footer-title">For Job Seekers</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Browse Jobs</a></li>
              <li><a href="#" className="footer-link">Resume Builder</a></li>
              <li><a href="#" className="footer-link">Career Advice</a></li>
              <li><a href="#" className="footer-link">Salary Guide</a></li>
              <li><a href="#" className="footer-link">Interview Tips</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="footer-section">
            <h3 className="footer-title">For Employers</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Post a Job</a></li>
              <li><a href="#" className="footer-link">Browse Candidates</a></li>
              <li><a href="#" className="footer-link">Pricing Plans</a></li>
              <li><a href="#" className="footer-link">Recruitment Solutions</a></li>
              <li><a href="#" className="footer-link">Employer Resources</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Press</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
              <li><a href="#" className="footer-link">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 RojgariHub. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <Heart className="heart-icon" /> for career growth
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="app">
      <Header />
      <SearchFilters />
      <JobList />
      <Footer />
    </div>
  );
}

export default App;