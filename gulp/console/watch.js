'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');
var del = require('del');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('console:watch', ['console:inject'], function () {
    gulp.watch([
        path.join(conf.paths.console.src, '/*.jade'),
        'bower.json'
    ], function (event) {
        gulp.start('console:inject-reload');
    });

    // html and jade
    gulp.watch([
        path.join(conf.paths.console.src, '/**/*.jade'),
        path.join(conf.paths.console.src, '/**/*.html')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('console:templates-reload');
        } else {
            gulp.start('console:inject-reload');
        }
    });

    // css and sass
    gulp.watch([
        path.join(conf.paths.console.src, '/**/*.css'),
        path.join(conf.paths.console.src, '/**/*.scss'),
        path.join(conf.paths.console.src, '/**/*.sass')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('console:styles-reload');
        } else {
            gulp.start('console:inject-reload');
        }
    });

    // javascript and livescript
    gulp.watch([
        path.join(conf.paths.console.src, '/**/*.ls'),
        path.join(conf.paths.console.src, '/**/*.js')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('console:scripts-reload');
        } else {
            gulp.start('console:inject-reload');
        }
    });

    gulp.watch([
        path.join(conf.paths.models, '/*.js'),
        path.join(conf.paths.models, '/*.json')
    ], ['console:loopback-reload']);

});
