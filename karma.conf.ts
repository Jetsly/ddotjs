module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [{
      pattern: 'src/**/*.ts'
    } ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    }
  })
}
