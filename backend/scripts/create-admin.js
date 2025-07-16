import Admin from '../models/Admin.js';
import sequelize from '../config/database.js';

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    const existingAdmin = await Admin.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('Admin already exists with this email.');
      return;
    }


    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin'
    });

    console.log('Admin created successfully:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Admin ID:', admin.id);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createAdmin();
