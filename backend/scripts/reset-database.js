import sequelize from '../config/database.js';
import models from '../models/index.js';

const resetDatabase = async () => {
  try {
    console.log('Starting database reset...');
    console.log('WARNING: This will drop all tables and recreate them. All data will be lost!');
    
    await sequelize.sync({ force: true });
    
    console.log('Database reset completed successfully.');
    console.log('All tables have been recreated with the latest schema.');
    
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
};

const runReset = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await resetDatabase();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

runReset();