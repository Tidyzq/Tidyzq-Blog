'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('console:scripts-reload', function() {
  return buildScripts()
    .pipe(browserSync.stream());
});

gulp.task('console:scripts', function() {
  return buildScripts();
});

function copyJavascripts() {
  return gulp.src([
    path.join(conf.paths.console.src, '/**/*.js')
  ])
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildLivescripts() {
  return gulp.src([
    path.join(conf.paths.console.src, '/**/*.ls')
  ])
    .pipe($.livescript({bare: false}))
    .on('error', conf.errorHandler('livescript'))
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildScripts() {
  var _js = copyJavascripts(),
      _ls = buildLivescripts();

  return merge(_js, _ls);
}
