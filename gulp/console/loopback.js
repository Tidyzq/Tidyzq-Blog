'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('console:loopback-reload', function () {
  return buildLoopbackService()
    .pipe(browserSync.stream());
});

gulp.task('console:loopback', function () {
  return buildLoopbackService();
});

function buildLoopbackService() {
  return gulp.src(conf.paths.server)
    .pipe($.loopbackSdkAngular())
    .on('error', conf.errorHandler('loopbackAngular'))
    .pipe($.rename(conf.paths.lbServices))
    .pipe(gulp.dest(conf.paths.console.tmp));
}
