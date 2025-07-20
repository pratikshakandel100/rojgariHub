import { Sequelize, DataTypes } from 'sequelize';
import crypto from 'crypto';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the PasswordReset model for testing
const PasswordReset = testSequelize.define('PasswordReset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  userType: {
    type: DataTypes.ENUM('Admin', 'Employee', 'JobSeeker'),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => crypto.randomBytes(32).toString('hex')
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'password_resets',
  timestamps: true
});

// Add instance methods
PasswordReset.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

PasswordReset.prototype.markAsUsed = function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

describe('🧪 PasswordReset Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create password reset token with default values', async () => {
    const reset = await PasswordReset.create({
      email: 'user@example.com',
      userType: 'Employee'
    });

    expect(reset.id).toBeDefined();
    expect(reset.email).toBe('user@example.com');
    expect(reset.userType).toBe('Employee');
    expect(reset.token).toBeDefined();
    expect(reset.token.length).toBe(64); // 32 bytes as hex
    expect(reset.expiresAt).toBeDefined();
    expect(reset.isUsed).toBe(false);
    expect(reset.createdAt).toBeDefined();
    expect(reset.updatedAt).toBeDefined();
  });

  test('should generate unique token for each reset request', async () => {
    const reset1 = await PasswordReset.create({
      email: 'user1@example.com',
      userType: 'JobSeeker'
    });

    const reset2 = await PasswordReset.create({
      email: 'user2@example.com',
      userType: 'Admin'
    });

    expect(reset1.token).not.toBe(reset2.token);
  });

  test('should allow all user types', async () => {
    const userTypes = ['Admin', 'Employee', 'JobSeeker'];
    
    for (const type of userTypes) {
      const reset = await PasswordReset.create({
        email: `${type.toLowerCase()}@example.com`,
        userType: type
      });

      expect(reset.userType).toBe(type);
    }
  });

  test('should correctly identify expired tokens', async () => {
    // Create token that expires in 1ms (effectively expired)
    const expiredReset = await PasswordReset.create({
      email: 'expired@example.com',
      userType: 'Employee',
      expiresAt: new Date(Date.now() - 1) // Set to past
    });

    // Create valid token
    const validReset = await PasswordReset.create({
      email: 'valid@example.com',
      userType: 'JobSeeker'
    });

    expect(expiredReset.isExpired()).toBe(true);
    expect(validReset.isExpired()).toBe(false);
  });

  test('should mark token as used', async () => {
    const reset = await PasswordReset.create({
      email: 'markused@example.com',
      userType: 'Admin'
    });

    await reset.markAsUsed();

    expect(reset.isUsed).toBe(true);
    expect(reset.usedAt).toBeDefined();
  });

  test('should validate email format', async () => {
    await expect(PasswordReset.create({
      email: 'invalid-email',
      userType: 'Employee'
    })).rejects.toThrow();

    const reset = await PasswordReset.create({
      email: 'valid.email@example.com',
      userType: 'Employee'
    });

    expect(reset.email).toBe('valid.email@example.com');
  });

  test('should set expiry to 1 hour from creation by default', async () => {
    const beforeCreation = new Date();
    const reset = await PasswordReset.create({
      email: 'expiry@example.com',
      userType: 'JobSeeker'
    });

    const expectedExpiry = new Date(beforeCreation.getTime() + 60 * 60 * 1000);
    const timeDifference = reset.expiresAt.getTime() - expectedExpiry.getTime();

    // Allow small difference due to test execution time
    expect(Math.abs(timeDifference)).toBeLessThan(1000);
  });

  test('should handle additional optional fields', async () => {
    const reset = await PasswordReset.create({
      email: 'optional@example.com',
      userType: 'Admin',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Test Agent)'
    });

    expect(reset.ipAddress).toBe('192.168.1.1');
    expect(reset.userAgent).toBe('Mozilla/5.0 (Test Agent)');
  });
});