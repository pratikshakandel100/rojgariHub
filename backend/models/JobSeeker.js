import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const JobSeeker = sequelize.define('JobSeeker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  workExperience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hobbies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  expectedSalary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobPreferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'jobseeker'
  },
  profileViews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  profileViewsThisWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'job_seekers',
  timestamps: true,
  hooks: {
    beforeCreate: async (jobSeeker) => {
      if (jobSeeker.password) {
        const salt = await bcrypt.genSalt(10);
        jobSeeker.password = await bcrypt.hash(jobSeeker.password, salt);
      }
    },
    beforeUpdate: async (jobSeeker) => {
      if (jobSeeker.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        jobSeeker.password = await bcrypt.hash(jobSeeker.password, salt);
      }
    }
  }
});

JobSeeker.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

JobSeeker.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

export default JobSeeker;