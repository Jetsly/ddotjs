
let reporters = ['mocha','coverage']
let coverageReporter = {
  type: 'html' ,
  dir: 'test/coverage'
}

if (process.env.TRAVIS) {
  coverageReporter.type = 'lcov'
  reporters.push('coveralls')
}

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
    reporters,
    coverageReporter,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  })
}
