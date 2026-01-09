import bcrypt from 'bcryptjs';
import { Sequelize, DataTypes } from 'sequelize';


const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const Admin = testSequelize.define('Admin', {
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'admin'
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
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      }
    }
  }
});

// Add model methods
Admin.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

Admin.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

describe('🧪 Admin Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create admin with hashed password', async () => {
    const admin = await Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(admin.id).toBeDefined();
    expect(admin.password).not.toBe('password123');
    expect(await bcrypt.compare('password123', admin.password)).toBe(true);
  });

  test('should validate password correctly', async () => {
    const admin = await Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@example.com',
      password: 'password123'
    });

    expect(await admin.comparePassword('password123')).toBe(true);
    expect(await admin.comparePassword('wrongpassword')).toBe(false);
  });

  test('should omit password in toJSON()', async () => {
    const admin = await Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test3@example.com',
      password: 'password123'
    });

    const adminJson = admin.toJSON();
    expect(adminJson.password).toBeUndefined();
  });

  test('should hash password on update', async () => {
    const admin = await Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test4@example.com',
      password: 'password123'
    });

    const originalHash = admin.password;
    admin.password = 'newpassword';
    await admin.save();

    expect(admin.password).not.toBe(originalHash);
    expect(await bcrypt.compare('newpassword', admin.password)).toBe(true);
  });

  test('should set default values', async () => {
    const admin = await Admin.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test5@example.com',
      password: 'password123'
    });

    expect(admin.isActive).toBe(true);
    expect(admin.role).toBe('admin');
    expect(admin.profileViews).toBe(0);
    expect(admin.profileViewsThisWeek).toBe(0);
    expect(admin.permissions).toEqual([]);
  });
});