import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Download, 
  ExternalLink,
  Star,
  Clock,
  Globe,
  Linkedin,
  Github,
  Eye
} from 'lucide-react';

const UserView = ({ userId }) => {
  // Mock user data - in real app, this would come from API
  const userData = {
    id: userId || "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    profileImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    experience: "5+ years",
    bio: "Passionate frontend developer with expertise in React, TypeScript, and modern web technologies. Love creating intuitive user experiences and solving complex problems.",
    skills: [
      { name: "React", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 95 },
      { name: "Node.js", level: 85 },
      { name: "Python", level: 80 },
      { name: "AWS", level: 75 },
      { name: "Docker", level: 70 },
      { name: "GraphQL", level: 85 }
    ],
    workExperience: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        duration: "2022 - Present",
        location: "San Francisco, CA",
        description: "Lead frontend development for enterprise applications, mentor junior developers, and architect scalable React solutions."
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        duration: "2020 - 2022",
        location: "Remote",
        description: "Developed responsive web applications using React and TypeScript, collaborated with design team to implement pixel-perfect UIs."
      },
      {
        title: "Junior Developer",
        company: "WebCorp",
        duration: "2019 - 2020",
        location: "New York, NY",
        description: "Built interactive web components, optimized website performance, and maintained legacy codebases."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        year: "2019",
        gpa: "3.8/4.0"
      },
      {
        degree: "Full Stack Web Development Certificate",
        institution: "freeCodeCamp",
        year: "2018",
        gpa: null
      }
    ],
    certifications: [
      "AWS Certified Developer Associate",
      "React Professional Certification",
      "Google Cloud Platform Associate"
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      portfolio: "https://sarahjohnson.dev"
    },
    resumeUrl: "/resume/sarah-johnson-resume.pdf",
    joinDate: "January 2024",
  };

  const getSkillColor = (level) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 80) return 'bg-blue-500';
    if (level >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              <div className="relative -mt-16 mb-4 sm:mb-0">
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                    <p className="text-xl text-gray-600 mt-1">{userData.title}</p>
                    <p className="text-lg text-gray-500">{userData.company}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <div className="flex items-center space-x-1">
                    
            
                    </div>
                    
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {userData.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {userData.experience}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {userData.joinDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Active {userData.lastActive}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSkillColor(skill.level)} transition-all duration-300`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
              <div className="space-y-6">
                {userData.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{exp.duration}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
              <div className="space-y-4">
                {userData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600 font-medium">{edu.institution}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{edu.year}</span>
                      {edu.gpa && (
                        <>
                          <span>•</span>
                          <span>GPA: {edu.gpa}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{userData.location}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Links</h2>
              <div className="space-y-3">
                <a
                  href={userData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={userData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href={userData.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span>Portfolio Website</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Resume Download */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resume</h2>
              <a
                href={userData.resumeUrl}
                download
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Resume
              </a>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-2">
                {userData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
