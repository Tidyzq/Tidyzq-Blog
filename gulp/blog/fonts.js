'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('blog:fonts', function () {
  return copyFonts();
});

function copyFonts() {
  return gulp.src([
    path.join(conf.paths.blog.src, '/**/*.{eot,svg,ttf,woff,woff2}')
  ])
    .pipe(gulp.dest(conf.paths.blog.tmp));
}
