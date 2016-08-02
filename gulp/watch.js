'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var del = require('del');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('clean', function (cb) {
    return del(path.join(conf.paths.tmp, '/'), cb);
});

gulp.task('watch', ['inject'], function () {
    gulp.watch([
        path.join(conf.paths.src, '/*.html'),
        path.join(conf.paths.src, '/*.jade'),
        'bower.json'
    ], ['htmls-reload'], function (event) {
        gulp.start('inject-reload');
    });

    gulp.watch([
        path.join(conf.paths.src, '/**/*.css'),
        '!' + path.join(conf.paths.tmp, '/**/*.css')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('styles-reload');
        } else {
            gulp.start('inject-reload');
        }
    });

    gulp.watch([
        path.join(conf.paths.src, '/**/*.ls'),
        path.join(conf.paths.src, '/**/*.js'),
        '!' + path.join(conf.paths.tmp, '/**/*.js')
    ], function (event) {
        if (isOnlyChange(event)) {
            gulp.start('scripts-reload');
        } else {
            gulp.start('inject-reload');
        }
    });

    gulp.watch([
        path.join(conf.paths.src, '/**/*.jade'),
        path.join(conf.paths.src, '/**/*.html'),
        '!' + path.join(conf.paths.tmp, '/**/*.html')
    ], function (event) {
        gulp.start('htmls-reload');
    });

    gulp.watch([
        path.join(conf.paths.models, '/*.js'),
        path.join(conf.paths.models, '/*.json'),
    ], ['loopback-reload']);

});
