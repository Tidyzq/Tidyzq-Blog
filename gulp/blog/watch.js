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

gulp.task('blog:watch', ['blog:scripts', 'blog:styles', 'blog:fonts'], function () {

    // css and sass
    gulp.watch([
        path.join(conf.paths.blog.src, '/**/*.css'),
        path.join(conf.paths.blog.src, '/**/*.scss'),
        path.join(conf.paths.blog.src, '/**/*.sass')
    ], function (event) {
        gulp.start('blog:styles-reload');
    });

    // javascript and livescript
    gulp.watch([
        path.join(conf.paths.blog.src, '/**/*.ls'),
        path.join(conf.paths.blog.src, '/**/*.js')
    ], function (event) {
        gulp.start('blog:scripts-reload');
    });

});
