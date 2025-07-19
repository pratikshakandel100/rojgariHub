module.exports = {
  moduleNameMapper: {
    '^@app$': '<rootDir>/src/app.js',
    '^@models$': '<rootDir>/src/models/index.js'
  },
  // Add these if missing
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src']
}