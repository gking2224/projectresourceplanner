// Karma configuration
// Generated on Wed Sep 21 2016 13:52:31 GMT+0100 (BST)

var webpack = require('webpack')
const webpackConfig = require('./webpack.config')

webpackConfig.module.postLoaders = [
  {
    test: /common\/.*\.jsx?$/,
    loader: 'istanbul-instrumenter',
    query: {
      esModules: true
    },
  },
]


module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'], // requirejs causes much pain here!!!!


    // list of files / patterns to load in the browser
    files: [
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
      './node_modules/babel-polyfill/browser.js',
      'test/config/test-index.js',
    ],

    paths: {
      // deepFreeze: './node_modules/deep-freeze/index.js',
    },

    // list of files to exclude
    exclude: [
      '**/*.swp',
      '**/*.bak',
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/config/test-index.js': ['webpack', 'sourcemap'], // , 'sourcemap-writer', 'coverage'],
    },

    htmlReporter: {
      outputDir: 'karma_html', // where to put the reports
      templatePath: null, // set if you moved jasmine_template.html
      focusOnFailures: true, // reports show failures on start
      namedFiles: false, // name files instead of creating sub-directories
      pageTitle: null, // page title for reports; browser info by default
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
      reportName: 'report-summary-filename', // report summary filename; browser info by default
    },

    coverageReporter: {
      type: 'json',
      subdir: '.',
      file: 'km.coverage-final.json',
    },

    // coverageReporter: {
    //   reporters : [
    //     {"type": "text"},
    //     {"type": "html", dir: 'coverages'},
    //   ],
    // },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'html', 'coverage'],

    // web server port
    port: 9876,
    //
    //
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    //
    //
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    //
    //
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true, // please don't spam the console when running in karma!
    },

  })
}
