'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('styles-reload', function() {
  return copyStyles()
    .pipe(browserSync.stream());
});

gulp.task('styles', ['styles:copy']);

gulp.task('styles:copy', function () {
  return copyStyles();
});

function copyStyles() {
  return gulp.src([
    path.join(conf.paths.src, '/**/*.css'),
    '!' + path.join(conf.paths.tmp, '/**/*.css')
  ])
    .pipe(gulp.dest(conf.paths.tmp));
}

