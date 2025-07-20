import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the Application model for testing
const Application = testSequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  jobSeekerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'Pending', 
      'Reviewed', 
      'Accepted', 
      'Rejected', 
      'Withdrawn', 
      'Shortlisted', 
      'Hired'
    ),
    allowNull: false,
    defaultValue: 'Pending'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: true
});

describe('🧪 Application Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create an application with default status', async () => {
    const application = await Application.create({
      jobId: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
      jobSeekerId: 'b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901',
      employeeId: 'c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012'
    });

    expect(application.id).toBeDefined();
    expect(application.status).toBe('Pending');
    expect(application.jobId).toBe('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890');
    expect(application.createdAt).toBeDefined();
    expect(application.updatedAt).toBeDefined();
  });

  test('should create an application with cover letter and resume', async () => {
    const application = await Application.create({
      jobId: 'd4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123',
      jobSeekerId: 'e5f6g7h8-i9j0-1234-e5f6-g7h8i9j01234',
      employeeId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345',
      coverLetter: 'I am excited to apply for this position...',
      resume: 'resumes/myresume.pdf'
    });

    expect(application.coverLetter).toBe('I am excited to apply for this position...');
    expect(application.resume).toBe('resumes/myresume.pdf');
  });

  test('should update application status and reviewed fields', async () => {
    const application = await Application.create({
      jobId: 'g7h8i9j0-k1l2-3456-g7h8-i9j0k1l23456',
      jobSeekerId: 'h8i9j0k1-l2m3-4567-h8i9-j0k1l2m34567',
      employeeId: 'i9j0k1l2-m3n4-5678-i9j0-k1l2m3n45678'
    });

    await application.update({
      status: 'Reviewed',
      reviewedAt: new Date(),
      reviewedBy: 'a0b1c2d3-e4f5-6789-a0b1-c2d3e4f56789'
    });

    expect(application.status).toBe('Reviewed');
    expect(application.reviewedAt).toBeDefined();
    expect(application.reviewedBy).toBe('a0b1c2d3-e4f5-6789-a0b1-c2d3e4f56789');
  });

  test('should allow all enum status values', async () => {
    const statusValues = [
      'Pending', 'Reviewed', 'Accepted', 'Rejected', 
      'Withdrawn', 'Shortlisted', 'Hired'
    ];

    for (const status of statusValues) {
      const application = await Application.create({
        jobId: 'j0k1l2m3-n4o5-6789-j0k1-l2m3n4o56789',
        jobSeekerId: 'k1l2m3n4-o5p6-7890-k1l2-m3n4o5p67890',
        employeeId: 'l2m3n4o5-p6q7-8901-l2m3-n4o5p6q78901',
        status: status
      });

      expect(application.status).toBe(status);
    }
  });

  test('should store notes about the application', async () => {
    const application = await Application.create({
      jobId: 'm3n4o5p6-q7r8-9012-m3n4-o5p6q7r89012',
      jobSeekerId: 'n4o5p6q7-r8s9-0123-n4o5-p6q7r8s90123',
      employeeId: 'o5p6q7r8-s9t0-1234-o5p6-q7r8s9t01234',
      notes: 'Strong candidate with relevant experience'
    });

    expect(application.notes).toBe('Strong candidate with relevant experience');
  });
});