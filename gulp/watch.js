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
    return del([
        path.join(conf.paths.console.tmp, '/'),
        path.join(conf.paths.console.dist, '/'),
        path.join(conf.paths.blog.tmp, '/'),
        path.join(conf.paths.blog.dist, '/')
    ], cb);
});

gulp.task('watch', ['console:watch']);
