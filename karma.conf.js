// Karma configuration
// Generated on Sun Jun 07 2015 12:38:34 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular.js/angular.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'https://raw.githubusercontent.com/jasmine/jasmine-ajax/master/lib/mock-ajax.js',
      'bower_components/angular.js/angular-mocks.js',
      'src/assets/scripts/app.js',
      'src/assets/scripts/config/routing.js',
      'src/assets/scripts/controllers/main-controller.js',
      'src/assets/scripts/directives/settings-panel.js',
      'src/assets/scripts/factories/credits.js',
      'src/assets/scripts/factories/game-items.js',
      'src/assets/scripts/factories/game-map.js',
      'src/assets/scripts/factories/settings.js',
      'src/assets/scripts/factories/game-map.js',
      'src/assets/scripts/factories/save-data.js',
      'src/tests/unit/credits-factory.js',
      'src/tests/unit/game-map-factory.js',
      'src/tests/unit/game-item-factory.js',
      'src/tests/unit/settings-factory.js',
      'src/tests/unit/settings-panel-directive.js',
      'src/tests/unit/save-data-factory.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
