import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award,
  Code,
  Palette,
  DollarSign,
  Heart,
  Wrench,
  BookOpen,
  ChevronRight,
  Star,
  Building,
  Clock,
  Filter,
  Menu,
  X
} from 'lucide-react';
import "../style/Homepage.css";


const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();


  const jobCategories = [
    { icon: Code, name: 'Technology', jobs: '2,847', color: 'tech' },
    { icon: Palette, name: 'Design', jobs: '1,234', color: 'design' },
    { icon: DollarSign, name: 'Finance', jobs: '987', color: 'finance' },
    { icon: Heart, name: 'Healthcare', jobs: '1,456', color: 'healthcare' },
    { icon: Wrench, name: 'Engineering', jobs: '843', color: 'engineering' },
    { icon: BookOpen, name: 'Education', jobs: '672', color: 'education' },
    { icon: Briefcase, name: 'Business', jobs: '1,129', color: 'business' },
    { icon: Users, name: 'Marketing', jobs: '756', color: 'marketing' }
  ];

  const companies = [
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop',
    'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=120&h=60&fit=crop'
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'TechCorp',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      quote: 'RojgariHub helped me land my dream job in just 2 weeks. The platform is incredibly user-friendly!'
    },
    {
      name: 'Rahul Kumar',
      role: 'Product Manager',
      company: 'InnovateLabs',
      image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      quote: 'The quality of job listings and the matching algorithm is outstanding. Highly recommended!'
    },
    {
      name: 'Sneha Patel',
      role: 'UX Designer',
      company: 'DesignHub',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      quote: 'Found multiple opportunities that perfectly matched my skills. The process was seamless!'
    }
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">
              <div className="logo-icon">
                <Briefcase className="icon" />
              </div>
              <span className="logo-text">RojgariHub</span>
            </div>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a href="#" className="nav-link">Find Jobs</a>
              <a href="#" className="nav-link">Companies</a>
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>
            </nav>

            <div className="auth-buttons">
              <button className="btn-secondary">Login</button>
              <button className="btn-secondary" onClick={() => navigate("/Signin")}>Sign In</button>
              <button className="btn-primary">EmployeeZone</button>
            </div>

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Discover Your <span className="highlight">Perfect Career</span>
                <br />Opportunity Today
              </h1>
              <p className="hero-subtitle">
                Connect with top employers and find jobs that match your skills, passion, and career goals. 
                Your next big opportunity is just a search away.
              </p>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-bar">
                <div className="search-field">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="search-field">
                  <MapPin className="search-icon" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="search-input"
                  />
                </div>
                <button className="search-btn">
                  <Search className="btn-icon" />
                  Search Jobs
                </button>
              </div>
              <div className="search-suggestions">
                <span>Popular:</span>
                <button className="suggestion-tag">Remote</button>
                <button className="suggestion-tag">Full-time</button>
                <button className="suggestion-tag">React Developer</button>
                <button className="suggestion-tag">Product Manager</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">
              Find opportunities across various industries and specializations
            </p>
          </div>

          <div className="categories-grid">
            {jobCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.name} className={`category-card ${category.color}`}>
                  <div className="category-icon">
                    <IconComponent className="icon" />
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-jobs">{category.jobs} jobs</p>
                  <ChevronRight className="category-arrow" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              Hear from professionals who found their dream jobs through RojgariHub
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star filled" />
                    ))}
                  </div>
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                </div>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="trusted-companies">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-subtitle">
              Join thousands of professionals working at top companies
            </p>
          </div>

          <div className="companies-grid">
            {companies.map((company, index) => (
              <div key={index} className="company-logo-wrapper">
                <img src={company} alt={`Company ${index + 1}`} className="company-logo-img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">
                  <Briefcase className="icon" />
                </div>
                <span className="logo-text">RojgariHub</span>
              </div>
              <p className="footer-description">
                Connecting talented professionals with their dream careers. 
                Your success is our mission.
              </p>
              <div className="social-links">
                <a href="#" className="social-link facebook">f</a>
                <a href="#" className="social-link twitter">t</a>
                <a href="#" className="social-link linkedin">in</a>
                <a href="#" className="social-link instagram">ig</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">For Job Seekers</h3>
              <ul className="footer-links">
                <li><a href="#">Browse Jobs</a></li>
                <li><a href="#">Resume Builder</a></li>
                <li><a href="#">Career Advice</a></li>
                <li><a href="#">Salary Guide</a></li>
                <li><a href="#">Interview Tips</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">For Employers</h3>
              <ul className="footer-links">
                <li><a href="#">Post a Job</a></li>
                <li><a href="#">Browse Candidates</a></li>
                <li><a href="#">Pricing Plans</a></li>
                <li><a href="#">Recruitment Solutions</a></li>
                <li><a href="#">Employer Resources</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 RojgariHub. All rights reserved.</p>
              <p>Made with ❤️ for career growth</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;