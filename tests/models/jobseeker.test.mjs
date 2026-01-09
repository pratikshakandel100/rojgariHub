import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const Employee = testSequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'employees',
  timestamps: true
});

const JobSeeker = testSequelize.define('JobSeeker', {
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'jobseeker'
  },
  // Add optional profile fields
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
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
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'job_seekers',
  timestamps: true,
  hooks: {
    beforeCreate: async (jobSeeker) => {
      const users = await Employee.findOne({
        where: {
          email: jobSeeker.email
        }
      });

      if (users) {
        throw new Error("Already email exists on employees table");
      }
      if (jobSeeker.password) {
        const salt = await bcrypt.genSalt(10);
        jobSeeker.password = await bcrypt.hash(jobSeeker.password, salt);
      }
    },
    beforeUpdate: async (jobSeeker) => {
      if (jobSeeker.changed('email')) {
        const users = await Employee.findOne({
          where: {
            email: jobSeeker.email
          }
        });
        if (users) {
          throw new Error("Already email exists on employees table");
        }
      }
      if (jobSeeker.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        jobSeeker.password = await bcrypt.hash(jobSeeker.password, salt);
      }
    }
  }
});

// Add model methods
JobSeeker.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

JobSeeker.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

describe('🧪 JobSeeker Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create job seeker with hashed password', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      phone: '1234567890'
    });

    expect(jobSeeker.id).toBeDefined();
    expect(jobSeeker.firstName).toBe('John');
    expect(jobSeeker.lastName).toBe('Doe');
    expect(jobSeeker.email).toBe('john.doe@example.com');
    expect(jobSeeker.password).not.toBe('securePassword123');
    expect(await bcrypt.compare('securePassword123', jobSeeker.password)).toBe(true);
    expect(jobSeeker.isActive).toBe(true);
    expect(jobSeeker.role).toBe('jobseeker');
  });

  test('should correctly validate password using comparePassword', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'anotherSecurePassword',
      phone: '9876543210'
    });

    expect(await jobSeeker.comparePassword('anotherSecurePassword')).toBe(true);
    expect(await jobSeeker.comparePassword('wrongPassword')).toBe(false);
  });

  test('should omit password when converting to JSON', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'hiddenPassword123',
      phone: '5551234567'
    });

    const jobSeekerJson = jobSeeker.toJSON();
    expect(jobSeekerJson.password).toBeUndefined();
    expect(jobSeekerJson.firstName).toBe('Alice');
    expect(jobSeekerJson.email).toBe('alice.johnson@example.com');
  });

  test('should hash password when updated', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@example.com',
      password: 'originalPassword',
      phone: '4445556666'
    });

    const originalHash = jobSeeker.password;
    jobSeeker.password = 'updatedPassword';
    await jobSeeker.save();

    expect(jobSeeker.password).not.toBe(originalHash);
    expect(jobSeeker.password).not.toBe('updatedPassword');
    expect(await bcrypt.compare('updatedPassword', jobSeeker.password)).toBe(true);
  });

  test('should prevent duplicate email with Employee', async () => {
    // First create an employee with this email
    await Employee.create({
      email: 'unique.email@example.com'
    });

    // Try to create job seeker with same email
    await expect(JobSeeker.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'unique.email@example.com',
      password: 'testPassword123',
      phone: '1112223333'
    })).rejects.toThrow('Already email exists on employees table');
  });

  test('should set default values correctly', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Default',
      lastName: 'Values',
      email: 'default.values@example.com',
      password: 'defaultPassword',
      phone: '9998887777'
    });

    expect(jobSeeker.isActive).toBe(true);
    expect(jobSeeker.role).toBe('jobseeker');
  });

  test('should validate required fields', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Required',
      lastName: 'Fields',
      email: 'required.fields@example.com',
      password: 'requiredFields123',
      phone: '1231231234'
    });

    expect(jobSeeker.firstName).toBe('Required');
    expect(jobSeeker.lastName).toBe('Fields');
    expect(jobSeeker.email).toBe('required.fields@example.com');
    expect(jobSeeker.phone).toBe('1231231234');
  });

  test('should handle optional profile fields', async () => {
    const jobSeeker = await JobSeeker.create({
      firstName: 'Profile',
      lastName: 'Complete',
      email: 'complete.profile@example.com',
      password: 'completeProfile123',
      phone: '5554443333',
      bio: 'Experienced software developer',
      location: 'San Francisco',
      skills: ['JavaScript', 'React', 'Node.js'],
      education: [{ degree: 'BSc Computer Science', university: 'Stanford' }],
      resume: 'resumes/john-doe.pdf'
    });

    expect(jobSeeker.bio).toBe('Experienced software developer');
    expect(jobSeeker.location).toBe('San Francisco');
    expect(jobSeeker.skills).toEqual(['JavaScript', 'React', 'Node.js']);
    expect(jobSeeker.education).toEqual([{ degree: 'BSc Computer Science', university: 'Stanford' }]);
    expect(jobSeeker.resume).toBe('resumes/john-doe.pdf');
  });
});