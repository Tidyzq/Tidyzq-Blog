'use strict';

var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('loopback-reload', function () {
  return buildLoopbackService()
    .pipe(browserSync.stream());
});

gulp.task('loopback', function () {
  return buildLoopbackService();
});

function buildLoopbackService() {
  return gulp.src(conf.paths.server)
    .pipe(loopbackAngular())
    .on('error', conf.errorHandler('loopbackAngular'))
    .pipe($.uglify())
    .pipe(rename(conf.paths.lbServices))
    .pipe(gulp.dest(conf.paths.tmp));
}
