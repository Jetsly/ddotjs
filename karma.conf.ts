module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [{
      pattern: 'src/**/*.ts'
    } ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        target: 'ES6'
      }
    },
    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  })
}
