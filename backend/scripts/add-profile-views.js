import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

async function addProfileViewsColumns() {
  try {
    console.log('Adding profileViews columns to database tables...');
    
    await sequelize.query(`
      ALTER TABLE employees 
      ADD COLUMN IF NOT EXISTS "profileViews" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "profileViewsThisWeek" INTEGER DEFAULT 0;
    `, { type: QueryTypes.RAW });
    
    await sequelize.query(`
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS "profileViews" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "profileViewsThisWeek" INTEGER DEFAULT 0;
    `, { type: QueryTypes.RAW });
    
    await sequelize.query(`
      ALTER TABLE job_seekers 
      ADD COLUMN IF NOT EXISTS "profileViews" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "profileViewsThisWeek" INTEGER DEFAULT 0;
    `, { type: QueryTypes.RAW });
    
    console.log('Successfully added profileViews columns to all tables');
    process.exit(0);
  } catch (error) {
    console.error('Error adding profileViews columns:', error);
    process.exit(1);
  }
}

addProfileViewsColumns();