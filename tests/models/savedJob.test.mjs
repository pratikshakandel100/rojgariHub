import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the SavedJob model for testing
const SavedJob = testSequelize.define('SavedJob', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobSeekerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'saved_jobs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobSeekerId', 'jobId']
    }
  ]
});

describe('🧪 SavedJob Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create a saved job entry', async () => {
    const savedJob = await SavedJob.create({
      jobSeekerId: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
      jobId: 'b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901'
    });

    expect(savedJob.id).toBeDefined();
    expect(savedJob.jobSeekerId).toBe('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890');
    expect(savedJob.jobId).toBe('b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901');
    expect(savedJob.savedAt).toBeDefined();
    expect(savedJob.createdAt).toBeDefined();
    expect(savedJob.updatedAt).toBeDefined();
  });

  test('should enforce unique jobSeekerId and jobId combination', async () => {
    const jobSeekerId = 'c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012';
    const jobId = 'd4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123';

    // First save should succeed
    await SavedJob.create({
      jobSeekerId: jobSeekerId,
      jobId: jobId
    });

    // Second save with same combination should fail
    await expect(SavedJob.create({
      jobSeekerId: jobSeekerId,
      jobId: jobId
    })).rejects.toThrow();
  });

  test('should automatically set savedAt timestamp', async () => {
    const beforeSave = new Date();
    const savedJob = await SavedJob.create({
      jobSeekerId: 'e5f6g7h8-i9j0-1234-e5f6-g7h8i9j01234',
      jobId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345'
    });

    expect(savedJob.savedAt).toBeDefined();
    expect(savedJob.savedAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
  });

  test('should allow multiple jobs for same job seeker', async () => {
    const jobSeekerId = 'g7h8i9j0-k1l2-3456-g7h8-i9j0k1l23456';
    const jobId1 = 'h8i9j0k1-l2m3-4567-h8i9-j0k1l2m34567';
    const jobId2 = 'i9j0k1l2-m3n4-5678-i9j0-k1l2m3n45678';

    await SavedJob.create({
      jobSeekerId: jobSeekerId,
      jobId: jobId1
    });

    const secondSave = await SavedJob.create({
      jobSeekerId: jobSeekerId,
      jobId: jobId2
    });

    expect(secondSave.jobSeekerId).toBe(jobSeekerId);
    expect(secondSave.jobId).toBe(jobId2);
  });

  test('should allow same job for different job seekers', async () => {
    const jobId = 'j0k1l2m3-n4o5-6789-j0k1-l2m3n4o56789';
    const jobSeekerId1 = 'k1l2m3n4-o5p6-7890-k1l2-m3n4o5p67890';
    const jobSeekerId2 = 'l2m3n4o5-p6q7-8901-l2m3-n4o5p6q78901';

    await SavedJob.create({
      jobSeekerId: jobSeekerId1,
      jobId: jobId
    });

    const secondSave = await SavedJob.create({
      jobSeekerId: jobSeekerId2,
      jobId: jobId
    });

    expect(secondSave.jobSeekerId).toBe(jobSeekerId2);
    expect(secondSave.jobId).toBe(jobId);
  });

  test('should maintain timestamps for creation and updates', async () => {
    const savedJob = await SavedJob.create({
      jobSeekerId: 'm3n4o5p6-q7r8-9012-m3n4-o5p6q7r89012',
      jobId: 'n4o5p6q7-r8s9-0123-n4o5-p6q7r8s90123'
    });

    const originalCreatedAt = savedJob.createdAt;
    const originalUpdatedAt = savedJob.updatedAt;

    // Wait a bit before updating
    await new Promise(resolve => setTimeout(resolve, 10));

    await savedJob.update({
      jobId: 'o5p6q7r8-s9t0-1234-o5p6-q7r8s9t01234'
    });

    expect(savedJob.createdAt).toEqual(originalCreatedAt);
    expect(savedJob.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});