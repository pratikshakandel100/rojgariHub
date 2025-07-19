module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@app': './src/app.js',
        '@models': './src/models/index.js'
      }
    }]
  ]
}