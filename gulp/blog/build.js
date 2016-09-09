'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var lazypipe = require('lazypipe');
var conf = require('../conf');

var $ = require('gulp-load-plugins')();

function buildJavascripts() {
  return gulp.src([
    path.join(conf.paths.blog.tmp, '/**/*.js')
  ])
    .pipe($.uglify()).on('error', conf.errorHandler('Uglify'))
    .pipe(gulp.dest(conf.paths.blog.dist));
}

function buildCss() {
  return gulp.src([
    path.join(conf.paths.blog.tmp, '/**/*.css')
  ])
    .pipe($.cssnano())
    .pipe(gulp.dest(conf.paths.blog.dist));
}

function build() {
  var _js = buildJavascripts(),
      _css = buildCss();

  return merge(_js, _css);
}

gulp.task('blog:build', ['blog:scripts', 'blog:styles'], function () {
  return build();
});
