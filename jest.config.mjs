export default {
  testEnvironment: 'node',
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    // Add aliases here if you use them, e.g. "^@models(.*)$": "<rootDir>/backend/models$1"
  }
};