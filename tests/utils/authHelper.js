const jwt = require('jsonwebtoken');

const generateToken = (userId, userType) => {
  return jwt.sign({ id: userId, userType }, process.env.JWT_SECRET || 'test-secret');
};

module.exports = { generateToken };