import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the Notification model for testing
const Notification = testSequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  recipientType: {
    type: DataTypes.ENUM('admin', 'employee', 'jobseeker'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'application_received',
      'application_approved',
      'application_rejected',
      'job_posted',
      'profile_viewed',
      'system_message'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

describe('🧪 Notification Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create a basic notification with required fields', async () => {
    const notification = await Notification.create({
      recipientId: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
      recipientType: 'jobseeker',
      type: 'application_approved',
      title: 'Application Approved',
      message: 'Your application for Software Engineer has been approved'
    });

    expect(notification.id).toBeDefined();
    expect(notification.recipientId).toBe('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890');
    expect(notification.recipientType).toBe('jobseeker');
    expect(notification.type).toBe('application_approved');
    expect(notification.title).toBe('Application Approved');
    expect(notification.message).toBe('Your application for Software Engineer has been approved');
    expect(notification.isRead).toBe(false);
    expect(notification.createdAt).toBeDefined();
    expect(notification.updatedAt).toBeDefined();
  });

  test('should create a notification with sender information', async () => {
    const notification = await Notification.create({
      recipientId: 'b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901',
      recipientType: 'employee',
      senderId: 'c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012',
      senderType: 'admin',
      type: 'job_posted',
      title: 'New Job Posted',
      message: 'A new job matching your preferences has been posted'
    });

    expect(notification.senderId).toBe('c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012');
    expect(notification.senderType).toBe('admin');
  });

  test('should allow all recipient types', async () => {
    const recipientTypes = ['admin', 'employee', 'jobseeker'];
    
    for (const type of recipientTypes) {
      const notification = await Notification.create({
        recipientId: 'd4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123',
        recipientType: type,
        type: 'system_message',
        title: 'System Message',
        message: 'This is a system notification'
      });

      expect(notification.recipientType).toBe(type);
    }
  });

  test('should allow all notification types', async () => {
    const notificationTypes = [
      'application_received',
      'application_approved',
      'application_rejected',
      'job_posted',
      'profile_viewed',
      'system_message'
    ];
    
    for (const type of notificationTypes) {
      const notification = await Notification.create({
        recipientId: 'e5f6g7h8-i9j0-1234-e5f6-g7h8i9j01234',
        recipientType: 'admin',
        type: type,
        title: `${type.replace('_', ' ')} notification`,
        message: `This is a ${type.replace('_', ' ')} notification`
      });

      expect(notification.type).toBe(type);
    }
  });

  test('should mark notification as read', async () => {
    const notification = await Notification.create({
      recipientId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345',
      recipientType: 'jobseeker',
      type: 'profile_viewed',
      title: 'Profile Viewed',
      message: 'Your profile was viewed by a recruiter'
    });

    await notification.update({ isRead: true });

    expect(notification.isRead).toBe(true);
  });

  test('should handle related entity information', async () => {
    const notification = await Notification.create({
      recipientId: 'g7h8i9j0-k1l2-3456-g7h8-i9j0k1l23456',
      recipientType: 'employee',
      type: 'application_received',
      title: 'New Application',
      message: 'You received a new application for your job posting',
      relatedEntityId: 'h8i9j0k1-l2m3-4567-h8i9-j0k1l2m34567',
      relatedEntityType: 'application'
    });

    expect(notification.relatedEntityId).toBe('h8i9j0k1-l2m3-4567-h8i9-j0k1l2m34567');
    expect(notification.relatedEntityType).toBe('application');
  });

  test('should automatically set timestamps', async () => {
    const notification = await Notification.create({
      recipientId: 'i9j0k1l2-m3n4-5678-i9j0-k1l2m3n45678',
      recipientType: 'admin',
      type: 'system_message',
      title: 'System Update',
      message: 'The system will be down for maintenance'
    });

    expect(notification.createdAt).toBeDefined();
    expect(notification.updatedAt).toBeDefined();
    expect(notification.createdAt).toEqual(notification.updatedAt);
  });
});