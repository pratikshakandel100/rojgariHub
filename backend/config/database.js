import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize = {};

if (process.env.NODE_ENV === 'test') {
  // Provide a mock sequelize with a define method for tests
  sequelize = {
    define: () => function Admin() {}, // returns an empty object for any model
  };
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

export default sequelize;