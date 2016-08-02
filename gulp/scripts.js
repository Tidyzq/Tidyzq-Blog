'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function() {
  return merge(buildScripts(), copyScripts())
    .pipe(browserSync.stream());
});

gulp.task('scripts', ['scripts:copy', 'scripts:build']);

gulp.task('scripts:copy', function () {
  return copyScripts();
});

gulp.task('scripts:build', function () {
  return buildScripts();
});

function copyScripts() {
  return gulp.src([
    path.join(conf.paths.src, '/**/*.js'),
    '!' + path.join(conf.paths.tmp, '/**/*.js')
  ])
    .pipe($.uglify())
    .pipe(gulp.dest(conf.paths.tmp));
}

function buildScripts() {
  return gulp.src(path.join(conf.paths.src, '/**/*.ls'))
    .pipe($.livescript({bare: false}))
    .on('error', conf.errorHandler('livescript'))
    .pipe($.uglify())
    .pipe(gulp.dest(conf.paths.tmp));
}
