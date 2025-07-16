import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

async function updateApplicationStatusEnum() {
  try {
    console.log('Updating application status enum...');
    
    await sequelize.query(`
      ALTER TYPE enum_applications_status ADD VALUE IF NOT EXISTS 'Shortlisted';
    `, { type: QueryTypes.RAW });
    
    await sequelize.query(`
      ALTER TYPE enum_applications_status ADD VALUE IF NOT EXISTS 'Hired';
    `, { type: QueryTypes.RAW });
    
    console.log('Successfully updated application status enum');
    process.exit(0);
  } catch (error) {
    console.error('Error updating application status enum:', error);
    process.exit(1);
  }
}

updateApplicationStatusEnum();