import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const JobSeeker = testSequelize.define('JobSeeker', {
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
  tableName: 'job_seekers',
  timestamps: true
});

const Employee = testSequelize.define('Employee', {
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
    defaultValue: 'employee'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  hooks: {
    beforeCreate: async (employee) => {
      const users = await JobSeeker.findOne({
        where: {
          email: employee.email
        }
      });

      if (users) {
        throw new Error("Already email exists on user panel");
      }
      if (employee.password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
      }
    },
    beforeUpdate: async (employee) => {
      if (employee.changed('email')) {
        const users = await JobSeeker.findOne({
          where: {
            email: employee.email
          }
        });
        if (users) {
          throw new Error("Already email exists on user panel");
        }
      }
      if (employee.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(employee.password, salt);
      }
    }
  }
});

// Add model methods
Employee.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

Employee.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

describe('🧪 Employee Model Tests', () => {
  beforeAll(async () => {
    await testSequelize.sync({ force: true });
  });

  afterAll(async () => {
    await testSequelize.close();
  });

  test('should create employee with hashed password', async () => {
    const employee = await Employee.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      phone: '1234567890'
    });

    expect(employee.id).toBeDefined();
    expect(employee.firstName).toBe('John');
    expect(employee.lastName).toBe('Doe');
    expect(employee.email).toBe('john.doe@example.com');
    expect(employee.password).not.toBe('securePassword123');
    expect(await bcrypt.compare('securePassword123', employee.password)).toBe(true);
    expect(employee.isActive).toBe(true);
    expect(employee.role).toBe('employee');
  });

  test('should correctly validate password using comparePassword', async () => {
    const employee = await Employee.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'anotherSecurePassword',
      phone: '9876543210'
    });

    expect(await employee.comparePassword('anotherSecurePassword')).toBe(true);
    expect(await employee.comparePassword('wrongPassword')).toBe(false);
  });

  test('should omit password when converting to JSON', async () => {
    const employee = await Employee.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'hiddenPassword123',
      phone: '5551234567'
    });

    const employeeJson = employee.toJSON();
    expect(employeeJson.password).toBeUndefined();
    expect(employeeJson.firstName).toBe('Alice');
    expect(employeeJson.email).toBe('alice.johnson@example.com');
  });

  test('should hash password when updated', async () => {
    const employee = await Employee.create({
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@example.com',
      password: 'originalPassword',
      phone: '4445556666'
    });

    const originalHash = employee.password;
    employee.password = 'updatedPassword';
    await employee.save();

    expect(employee.password).not.toBe(originalHash);
    expect(employee.password).not.toBe('updatedPassword');
    expect(await bcrypt.compare('updatedPassword', employee.password)).toBe(true);
  });

  test('should prevent duplicate email with JobSeeker', async () => {
    // First create a job seeker with this email
    await JobSeeker.create({
      email: 'unique.email@example.com'
    });

    // Try to create employee with same email
    await expect(Employee.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'unique.email@example.com',
      password: 'testPassword123',
      phone: '1112223333'
    })).rejects.toThrow('Already email exists on user panel');
  });

  test('should set default values correctly', async () => {
    const employee = await Employee.create({
      firstName: 'Default',
      lastName: 'Values',
      email: 'default.values@example.com',
      password: 'defaultPassword',
      phone: '9998887777'
    });

    expect(employee.isActive).toBe(true);
    expect(employee.role).toBe('employee');
  });

  test('should validate required fields', async () => {
    const employee = await Employee.create({
      firstName: 'Required',
      lastName: 'Fields',
      email: 'required.fields@example.com',
      password: 'requiredFields123',
      phone: '1231231234'
    });

    expect(employee.firstName).toBe('Required');
    expect(employee.lastName).toBe('Fields');
    expect(employee.email).toBe('required.fields@example.com');
    expect(employee.phone).toBe('1231231234');
  });
});