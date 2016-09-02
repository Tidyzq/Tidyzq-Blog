'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('console:inject-reload', function() {
    return buildInjection()
        .pipe(browserSync.stream());
});

gulp.task('console:inject', ['console:scripts', 'console:templates', 'console:styles', 'console:loopback'], function() {
    return buildInjection();
});

function buildInjection() {
    var injectStyles = gulp.src([
            path.join(conf.paths.console.tmp, '/**/*.css')
        ]);

    var injectScripts = gulp.src([
            path.join(conf.paths.console.tmp, '/**/*.js')
        ])
        .pipe($.angularFilesort());

    var injectOptions = {
        ignorePath  : conf.paths.tmp,
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.console.tmp, '/index.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .on('error', conf.errorHandler('inject'))
        .pipe(wiredep(_.extend({
            ignorePath: '../../'
        }, conf.wiredep)))
        .on('error', conf.errorHandler('wiredep'))
        .pipe(gulp.dest(conf.paths.console.tmp));
}
