import { validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Custom validation helpers
export const customValidators = {
  // Check if password is strong
  isStrongPassword: (value) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    return strongPasswordRegex.test(value);
  },
  
  // Check if phone number is valid (basic validation)
  isValidPhone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
  },
  
  // Check if URL is valid
  isValidURL: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  // Check if array has valid length
  isValidArrayLength: (value, min = 0, max = 100) => {
    return Array.isArray(value) && value.length >= min && value.length <= max;
  },
  
  // Check if string contains only allowed characters
  isAlphanumericWithSpaces: (value) => {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(value);
  },
  
  // Check if date is in the past
  isPastDate: (value) => {
    const date = new Date(value);
    return date < new Date();
  },
  
  // Check if date is in the future
  isFutureDate: (value) => {
    const date = new Date(value);
    return date > new Date();
  },
  
  // Check if salary range is valid
  isValidSalaryRange: (value) => {
    if (typeof value === 'string') {
      const salaryRegex = /^\d+(-\d+)?$/;
      return salaryRegex.test(value.replace(/[\s,]/g, ''));
    }
    return false;
  },
  
  // Check if skills array contains valid skills
  isValidSkillsArray: (value) => {
    if (!Array.isArray(value)) return false;
    return value.every(skill => 
      typeof skill === 'string' && 
      skill.trim().length > 0 && 
      skill.length <= 50
    );
  },
  
  // Check if experience level is valid
  isValidExperienceLevel: (value) => {
    const validLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
    return validLevels.includes(value);
  },
  
  // Check if job type is valid
  isValidJobType: (value) => {
    const validTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'];
    return validTypes.includes(value);
  },
  
  // Check if work mode is valid
  isValidWorkMode: (value) => {
    const validModes = ['Remote', 'On-site', 'Hybrid'];
    return validModes.includes(value);
  }
};

// Sanitization helpers
export const sanitizers = {
  // Remove HTML tags
  stripHtml: (value) => {
    return value.replace(/<[^>]*>/g, '');
  },
  
  // Normalize phone number
  normalizePhone: (value) => {
    return value.replace(/[\s\-\(\)]/g, '');
  },
  
  // Normalize URL
  normalizeUrl: (value) => {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  },
  
  // Trim and normalize spaces
  normalizeText: (value) => {
    return value.trim().replace(/\s+/g, ' ');
  },
  
  // Convert to title case
  toTitleCase: (value) => {
    return value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
};

// Common validation chains
export const commonValidations = {
  email: {
    isEmail: { errorMessage: 'Please provide a valid email address' },
    normalizeEmail: true
  },
  
  password: {
    isLength: { 
      options: { min: 6, max: 100 },
      errorMessage: 'Password must be between 6 and 100 characters'
    }
  },
  
  name: {
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Name must be between 2 and 50 characters'
    },
    matches: {
      options: /^[a-zA-Z\s]+$/,
      errorMessage: 'Name can only contain letters and spaces'
    }
  },
  
  phone: {
    isMobilePhone: {
      options: 'any',
      errorMessage: 'Please provide a valid phone number'
    }
  },
  
  url: {
    isURL: {
      options: { require_protocol: true },
      errorMessage: 'Please provide a valid URL'
    }
  },
  
  uuid: {
    isUUID: {
      options: 4,
      errorMessage: 'Invalid ID format'
    }
  }
};

export default validateRequest;