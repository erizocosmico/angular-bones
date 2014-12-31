'use strict';

var gulp = require('gulp'),
    karma = require('karma').server,
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    esnext = require('gulp-esnext'),
    angularTemplates = require('gulp-angular-templates'),
    lessPath = __dirname + '/less/main.less',
    lessDstPath = __dirname + '/dist/css/',
    jsPath = __dirname + '/js/**/*.js',
    tplPath = __dirname + '/templates/**/*.html',
    jsDstPath = __dirname + '/dist/js/',
    testJsPath = __dirname + '/tests/src/',
    tplDstPath = __dirname + '/dist/templates/',
    testPath = __dirname + '/tests/unit/**/*.spec.js',
    // Just like with vendor paths, add CSS vendor paths
    cssPaths = [],
    vendorPaths = [
        // Add vendor paths if you need more
        'jquery/dist/jquery.min.js',
        'angular/angular.min.js',
        'angular-route/angular-route.min.js',
        'ngInfiniteScroll/build/ng-infinite-scroll.min.js'
    ];

// Starts karma runner and runs the tests
gulp.task('karma_server', function (done) {
    setTimeout(function () {
        karma.start({
            configFile: __dirname + '/tests/karma.conf.js',
            singleRun: true
        }, done);
    }, 1000);
});

// Copies the templates to the destination folder
gulp.task('templates', function () {
    return gulp.src(tplPath)
        .pipe(angularTemplates({
            module: 'app'
        }))
        .pipe(concat('templates.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDstPath));
});

// Builds vendor js sources
gulp.task('vendor', function () {
    gulp.src(vendorPaths.map(function (path) {
            return __dirname + '/lib/' + path;
        }))
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDstPath));
});

// Copies css files instaled by vendors to the dest folder
gulp.task('css', function () {
    gulp.src(cssPaths.map(function (path) {
            return __dirname + path;
        }))
        .pipe(gulp.dest(lessDstPath));
});

// Copies the index to the dist fodler
gulp.task('index', function () {
    gulp.src(__dirname + '/index.html')
        .pipe(gulp.dest(__dirname + '/dist/'));
});

// Watches for changes to index.html
gulp.task('index_watch', function () {
    gulp.watch(__dirname + '/index.html', ['index']);
});

// Builds less sources
gulp.task('less', function () {
    gulp.src(lessPath)
        .pipe(less())
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(lessDstPath));
});

// Builds js sources
gulp.task('js', function () {
    gulp.src(jsPath)
        .pipe(concat('app.min.js'))
        .pipe(esnext())
        .pipe(uglify())
        .pipe(gulp.dest(jsDstPath));
});

// Transpiles source files to ES5
gulp.task('to_es5', function () {
    gulp.src(jsPath)
        .pipe(esnext())
        .pipe(gulp.dest(testJsPath));
});

// Watches for less files changes
gulp.task('less_watch', function () {
    gulp.watch(lessPath, ['less']);
});

// Watches for changes to the angular source files
gulp.task('js_watch', function () {
    gulp.watch(jsPath, ['js']);
});

// Watches for changes to the templates
gulp.task('templates_watch', function () {
    gulp.watch(tplPath, ['templates']);
});

// Watches for changes on the development files
gulp.task('watch', ['less', 'js', 'css', 'vendor', 'index', 'templates', 'less_watch', 'js_watch', 'index_watch', 'templates_watch']);

// Default task
gulp.task('default', ['less', 'js', 'css', 'vendor', 'index', 'templates']);

// Runs tests on the karma server before transpiling the source files to ES5
gulp.task('test', ['to_es5', 'karma_server']);

// Watches for changes to the source files or the test specs and executes tests
gulp.task('test_watcher', function () {
    gulp.watch([jsPath, testPath], ['test']);
});

// Runs tests, then runs the watcher
gulp.task('test_watch', ['test', 'test_watcher']);