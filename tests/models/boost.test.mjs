import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the Boost model for testing
const Boost = testSequelize.define('Boost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  boostPlanId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  boostType: {
    type: DataTypes.ENUM('Basic', 'Standard', 'Premium'),
    allowNull: false,
    defaultValue: 'Basic'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  netRevenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Active', 'Expired', 'Rejected', 'Approved'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  submittedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  remainingDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'boosts',
  timestamps: true
});

describe('🧪 Boost Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create a boost with default values', async () => {
    const boost = await Boost.create({
      employeeId: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
      jobId: 'b2c3d4e5-f6g7-8901-b2c3-d4e5f6g78901',
      boostPlanId: 'c3d4e5f6-g7h8-9012-c3d4-e5f6g7h89012',
      duration: 7,
      price: 49.99
    });

    expect(boost.id).toBeDefined();
    expect(boost.boostType).toBe('Basic');
    expect(boost.status).toBe('Pending');
    expect(boost.paymentStatus).toBe('Pending');
    expect(boost.platformFee).toBe(0);
    expect(boost.netRevenue).toBe(0);
    expect(boost.views).toBe(0);
    expect(boost.clickRate).toBe(0);
    expect(boost.remainingDays).toBe(0);
    expect(boost.submittedDate).toBeDefined();
  });

  test('should create a premium boost with all fields', async () => {
    const boost = await Boost.create({
      employeeId: 'd4e5f6g7-h8i9-0123-d4e5-f6g7h8i90123',
      jobId: 'e5f6g7h8-i9j0-1234-e5f6-g7h8i9j01234',
      boostPlanId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345',
      boostType: 'Premium',
      duration: 30,
      price: 199.99,
      platformFee: 39.99,
      netRevenue: 160.00,
      status: 'Approved',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_123456789',
      approvedDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    expect(boost.boostType).toBe('Premium');
    expect(boost.status).toBe('Approved');
    expect(boost.paymentStatus).toBe('Paid');
    expect(Number(boost.price)).toBeCloseTo(199.99);
    expect(boost.transactionId).toBe('txn_123456789');
    expect(boost.expiryDate).toBeDefined();
  });

  test('should allow all boost type enum values', async () => {
    const types = ['Basic', 'Standard', 'Premium'];
    
    for (const type of types) {
      const boost = await Boost.create({
        employeeId: 'f6g7h8i9-j0k1-2345-f6g7-h8i9j0k12345',
        jobId: 'g7h8i9j0-k1l2-3456-g7h8-i9j0k1l23456',
        boostPlanId: 'h8i9j0k1-l2m3-4567-h8i9-j0k1l2m34567',
        duration: 7,
        price: 49.99,
        boostType: type
      });

      expect(boost.boostType).toBe(type);
    }
  });

  test('should allow all status enum values', async () => {
    const statuses = ['Pending', 'Active', 'Expired', 'Rejected', 'Approved'];
    
    for (const status of statuses) {
      const boost = await Boost.create({
        employeeId: 'i9j0k1l2-m3n4-5678-i9j0-k1l2m3n45678',
        jobId: 'j0k1l2m3-n4o5-6789-j0k1-l2m3n4o56789',
        boostPlanId: 'k1l2m3n4-o5p6-7890-k1l2-m3n4o5p67890',
        duration: 7,
        price: 49.99,
        status: status
      });

      expect(boost.status).toBe(status);
    }
  });

  test('should allow all payment status enum values', async () => {
    const paymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
    
    for (const status of paymentStatuses) {
      const boost = await Boost.create({
        employeeId: 'l2m3n4o5-p6q7-8901-l2m3-n4o5p6q78901',
        jobId: 'm3n4o5p6-q7r8-9012-m3n4-o5p6q7r89012',
        boostPlanId: 'n4o5p6q7-r8s9-0123-n4o5-p6q7r8s90123',
        duration: 7,
        price: 49.99,
        paymentStatus: status
      });

      expect(boost.paymentStatus).toBe(status);
    }
  });

  test('should update boost metrics correctly', async () => {
    const boost = await Boost.create({
      employeeId: 'o5p6q7r8-s9t0-1234-o5p6-q7r8s9t01234',
      jobId: 'p6q7r8s9-t0u1-2345-p6q7-r8s9t0u12345',
      boostPlanId: 'q7r8s9t0-u1v2-3456-q7r8-s9t0u1v23456',
      duration: 14,
      price: 99.99
    });

    await boost.update({
      views: 150,
      clickRate: 12.5,
      remainingDays: 5
    });

    expect(boost.views).toBe(150);
    expect(Number(boost.clickRate)).toBeCloseTo(12.5);
    expect(boost.remainingDays).toBe(5);
  });

  test('should handle rejection with reason', async () => {
    const boost = await Boost.create({
      employeeId: 'r8s9t0u1-v2w3-4567-r8s9-t0u1v2w34567',
      jobId: 's9t0u1v2-w3x4-5678-s9t0-u1v2w3x45678',
      boostPlanId: 't0u1v2w3-x4y5-6789-t0u1-v2w3x4y56789',
      duration: 7,
      price: 49.99
    });

    const rejectionDate = new Date();
    await boost.update({
      status: 'Rejected',
      rejectedDate: rejectionDate,
      rejectionReason: 'Job posting violates guidelines'
    });

    expect(boost.status).toBe('Rejected');
    expect(boost.rejectedDate).toEqual(rejectionDate);
    expect(boost.rejectionReason).toBe('Job posting violates guidelines');
  });
});