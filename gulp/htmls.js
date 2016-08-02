'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('htmls-reload', function() {
  return merge(buildJade(), copyHtml())
    .pipe(browserSync.stream());
});

gulp.task('htmls', ['htmls:build', 'htmls:copy']);

gulp.task('htmls:copy', function() {
  return copyHtml();
});

gulp.task('htmls:build', function() {
  return buildJade();
});

function copyHtml() {
  return gulp.src([
    path.join(conf.paths.src, '/**/*.html'),
    '!' + path.join(conf.paths.tmp, '/**/*.html')
  ])
    .pipe(gulp.dest(conf.paths.tmp));
}

function buildJade() {
  return gulp.src(path.join(conf.paths.src, '/**/*.jade'))
    .pipe($.jade({ pretty: true }))
    .on('error', conf.errorHandler('jade'))
    .pipe($.size())
    .pipe(gulp.dest(conf.paths.tmp));
}
