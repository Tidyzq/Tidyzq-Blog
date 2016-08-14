'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', function() {
    return buildInjection()
        .pipe(browserSync.stream());
});

gulp.task('inject', ['scripts', 'htmls', 'styles', 'loopback'], function() {
    return buildInjection();
});

function buildInjection() {
    var injectStyles = gulp.src([
            path.join(conf.paths.tmp, '/**/*.css')
        ])
        .pipe($.concatCss('all.css'))
        .pipe(gulp.dest(conf.paths.tmp))


    var injectScripts = gulp.src([
            path.join(conf.paths.tmp, '/**/*.js')
        ])
        .pipe($.uglify({
            mangle: false
        }))
        .pipe($.angularFilesort())
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.paths.tmp))

    var injectOptions = {
        ignorePath  : conf.paths.tmp,
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.tmp, '/index.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({
            ignorePath: conf.paths.vendor
        }, conf.wiredep)))
        .on('error', conf.errorHandler('wiredep'))
        .pipe(gulp.dest(conf.paths.tmp));
}
