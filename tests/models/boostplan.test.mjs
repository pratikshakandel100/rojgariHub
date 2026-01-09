import { Sequelize, DataTypes } from 'sequelize';

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

// Define the BoostPlan model for testing
const BoostPlan = testSequelize.define('BoostPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Basic', 'Standard', 'Premium', 'Enterprise'),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  visibilityMultiplier: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: false,
    defaultValue: 1.0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  badge: {
    type: DataTypes.STRING,
    allowNull: true
  },
  badgeColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'blue'
  }
}, {
  tableName: 'boost_plans',
  timestamps: true
});

describe('🧪 BoostPlan Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create a basic boost plan with default values', async () => {
    const plan = await BoostPlan.create({
      name: 'Basic Boost',
      type: 'Basic',
      duration: 7,
      price: 29.99
    });

    expect(plan.id).toBeDefined();
    expect(plan.name).toBe('Basic Boost');
    expect(plan.type).toBe('Basic');
    expect(plan.duration).toBe(7);
    expect(Number(plan.price)).toBeCloseTo(29.99);
    expect(plan.features).toEqual([]);
    expect(Number(plan.visibilityMultiplier)).toBeCloseTo(1.0);
    expect(plan.isActive).toBe(true);
    expect(plan.sortOrder).toBe(0);
    expect(plan.createdAt).toBeDefined();
    expect(plan.updatedAt).toBeDefined();
  });

  test('should create a premium boost plan with all fields', async () => {
    const features = [
      'Top placement in search results',
      'Priority customer support',
      'Analytics dashboard'
    ];
    
    const plan = await BoostPlan.create({
      name: 'Premium Boost',
      type: 'Premium',
      duration: 30,
      price: 199.99,
      features: features,
      visibilityMultiplier: 3.5,
      isActive: true,
      sortOrder: 3,
      description: 'Our most powerful job boosting package',
      badge: 'Most Popular',
      badgeColor: 'purple'
    });

    expect(plan.type).toBe('Premium');
    expect(plan.duration).toBe(30);
    expect(Number(plan.price)).toBeCloseTo(199.99);
    expect(plan.features).toEqual(features);
    expect(Number(plan.visibilityMultiplier)).toBeCloseTo(3.5);
    expect(plan.description).toBe('Our most powerful job boosting package');
    expect(plan.badge).toBe('Most Popular');
    expect(plan.badgeColor).toBe('purple');
  });

  test('should allow all plan type enum values', async () => {
    const types = ['Basic', 'Standard', 'Premium', 'Enterprise'];
    
    for (const type of types) {
      const plan = await BoostPlan.create({
        name: `${type} Plan`,
        type: type,
        duration: 7,
        price: 49.99
      });

      expect(plan.type).toBe(type);
    }
  });

  test('should handle JSON features array correctly', async () => {
    const features = [
      'Search priority',
      'Email alerts',
      'Social media promotion'
    ];
    
    const plan = await BoostPlan.create({
      name: 'Standard Boost',
      type: 'Standard',
      duration: 14,
      price: 99.99,
      features: features
    });

    expect(plan.features).toEqual(features);
    expect(plan.features.length).toBe(3);
  });

  test('should respect visibility multiplier values', async () => {
    const plan = await BoostPlan.create({
      name: 'High Visibility Plan',
      type: 'Enterprise',
      duration: 60,
      price: 499.99,
      visibilityMultiplier: 5.0
    });

    expect(Number(plan.visibilityMultiplier)).toBeCloseTo(5.0);
  });

  test('should handle badge and color customization', async () => {
    const plan = await BoostPlan.create({
      name: 'Best Value Plan',
      type: 'Standard',
      duration: 14,
      price: 89.99,
      badge: 'Best Value',
      badgeColor: 'green'
    });

    expect(plan.badge).toBe('Best Value');
    expect(plan.badgeColor).toBe('green');
  });

  test('should allow deactivating plans', async () => {
    const plan = await BoostPlan.create({
      name: 'Legacy Plan',
      type: 'Basic',
      duration: 7,
      price: 19.99,
      isActive: false
    });

    expect(plan.isActive).toBe(false);
  });

  test('should support sorting order', async () => {
    const plan = await BoostPlan.create({
      name: 'Featured Plan',
      type: 'Premium',
      duration: 30,
      price: 249.99,
      sortOrder: 1
    });

    expect(plan.sortOrder).toBe(1);
  });
});