'use strict';

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            '../lib/angular/angular.min.js',
            '../lib/angular-route/angular-route.min.js',
            '../lib/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'unit/**/*.spec.js'
        ],
        plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-spec-reporter'],
        port: 9876,
        colors: true,
        autoWatch: true,
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};