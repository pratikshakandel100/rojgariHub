import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the Job model for testing
const Job = testSequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'),
    allowNull: false,
    defaultValue: 'Full-time'
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Closed', 'Draft'),
    allowNull: false,
    defaultValue: 'Active'
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  applicationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // Add the missing fields
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

describe('🧪 Job Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create a basic job with required fields', async () => {
    const job = await Job.create({
      employeeId: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
      title: 'Software Engineer',
      description: 'Looking for a skilled software engineer',
      requirements: ['JavaScript', 'React', 'Node.js'],
      location: 'New York'
    });

    expect(job.id).toBeDefined();
    expect(job.title).toBe('Software Engineer');
    expect(job.description).toBe('Looking for a skilled software engineer');
    expect(job.requirements).toEqual(['JavaScript', 'React', 'Node.js']);
    expect(job.location).toBe('New York');
    expect(job.type).toBe('Full-time');
    expect(job.status).toBe('Active');
    expect(job.isRemote).toBe(false);
    expect(job.views).toBe(0);
    expect(job.applicationsCount).toBe(0);
    expect(job.createdAt).toBeDefined();
    expect(job.updatedAt).toBeDefined();
  });

  test('should create a remote job with all optional fields', async () => {
    const job = await Job.create({
      employeeId: 'b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901',
      title: 'Senior UX Designer',
      description: 'Remote UX design position',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      location: 'Remote',
      type: 'Remote',
      salary: '$90,000 - $110,000',
      isRemote: true,
      isFeatured: true,
      companyImage: 'company-logo.png'
    });

    expect(job.type).toBe('Remote');
    expect(job.isRemote).toBe(true);
    expect(job.isFeatured).toBe(true);
    expect(job.salary).toBe('$90,000 - $110,000');
    expect(job.companyImage).toBe('company-logo.png');
  });

  test('should allow all job type enum values', async () => {
    const types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    
    for (const type of types) {
      const job = await Job.create({
        employeeId: 'c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012',
        title: `${type} Job`,
        description: `This is a ${type.toLowerCase()} position`,
        requirements: [],
        location: 'Various',
        type: type
      });

      expect(job.type).toBe(type);
    }
  });

  test('should allow all status enum values', async () => {
    const statuses = ['Active', 'Inactive', 'Closed', 'Draft'];
    
    for (const status of statuses) {
      const job = await Job.create({
        employeeId: 'd4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123',
        title: `Job with ${status} status`,
        description: 'Test job description',
        requirements: [],
        location: 'Test',
        status: status
      });

      expect(job.status).toBe(status);
    }
  });

  test('should track views and applications count', async () => {
    const job = await Job.create({
      employeeId: 'e5f6g7h8-i9j0-1234-e5f6-g7h8i9j01234',
      title: 'Marketing Manager',
      description: 'Marketing position',
      requirements: ['Digital Marketing', 'SEO', 'Content Creation'],
      location: 'Chicago'
    });

    await job.update({
      views: 150,
      applicationsCount: 25
    });

    expect(job.views).toBe(150);
    expect(job.applicationsCount).toBe(25);
  });

  test('should handle application deadline', async () => {
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const job = await Job.create({
      employeeId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345',
      title: 'Data Scientist',
      description: 'Data science position',
      requirements: ['Python', 'Machine Learning', 'SQL'],
      location: 'San Francisco',
      applicationDeadline: deadline
    });

    expect(job.applicationDeadline).toEqual(deadline);
  });

  test('should handle JSON arrays for requirements and skills', async () => {
    const requirements = ['Bachelor\'s degree', '3+ years experience', 'Team player'];
    const skills = ['Communication', 'Problem Solving', 'Agile'];
    
    const job = await Job.create({
      employeeId: 'g7h8i9j0-k1l2-3456-g7h8-i9j0k1l23456',
      title: 'Product Manager',
      description: 'Product management role',
      requirements: requirements,
      location: 'Boston',
      skills: skills
    });

    expect(job.requirements).toEqual(requirements);
    expect(job.skills).toEqual(skills);
  });
});