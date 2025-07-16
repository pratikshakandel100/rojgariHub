import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const migrateNotificationsTable = async () => {
  try {
    console.log('Starting notifications table migration...');
    
    await sequelize.query(`
      ALTER TABLE notifications 
      ALTER COLUMN "recipientId" TYPE UUID USING "recipientId"::text::uuid,
      ALTER COLUMN "senderId" TYPE UUID USING "senderId"::text::uuid,
      ALTER COLUMN "relatedEntityId" TYPE UUID USING "relatedEntityId"::text::uuid;
    `, { type: QueryTypes.RAW });
    
    console.log('Notifications table migration completed successfully.');
  } catch (error) {
    if (error.message.includes('column "recipientId" cannot be cast automatically')) {
      console.log('Columns are already UUID type or need manual data cleanup.');
      console.log('Attempting to drop and recreate table...');
      
      try {
        await sequelize.query('DROP TABLE IF EXISTS notifications CASCADE;', { type: QueryTypes.RAW });
        console.log('Dropped notifications table.');
        
        await sequelize.sync({ force: false });
        console.log('Recreated notifications table with correct schema.');
      } catch (recreateError) {
        console.error('Error recreating table:', recreateError.message);
        throw recreateError;
      }
    } else {
      console.error('Migration error:', error.message);
      throw error;
    }
  }
};

const runMigration = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await migrateNotificationsTable();
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration();