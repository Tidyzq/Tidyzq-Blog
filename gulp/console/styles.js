'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('console:styles-reload', function() {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('console:styles', function () {
  return buildStyles();
});

function copyCss() {
  return gulp.src([
    path.join(conf.paths.console.src, '/**/*.css')
  ])
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildSass() {
  return gulp.src([
    path.join(conf.paths.console.src, '/**/*.scss'),
    path.join(conf.paths.console.src, '/**/*.sass')
  ])
    .pipe($.sass())
    .on('error', conf.errorHandler('sass'))
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildStyles() {
  var _css = copyCss(),
      _sass = buildSass();

  return merge(_css, _sass);
}

