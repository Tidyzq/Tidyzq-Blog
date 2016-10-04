'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('../conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('console:templates-reload', function() {
  return rebuildJade()
    .pipe(browserSync.stream());
});

gulp.task('console:templates', function() {
  return buildTemplates();
});

function copyHtml() {
  return gulp.src([
    path.join(conf.paths.console.src, '/**/*.html')
  ])
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildJade() {
  return gulp.src(path.join(conf.paths.console.src, '/**/*.jade'))
    .pipe($.jade({ pretty: true }))
    .on('error', conf.errorHandler('jade'))
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function rebuildJade() {
  return gulp.src([
      path.join(conf.paths.console.src, '/**/*.jade'),
      '!' + path.join(conf.paths.console.src, '/*.jade')
    ])
    .pipe($.jade({ pretty: true }))
    .on('error', conf.errorHandler('jade'))
    .pipe(gulp.dest(conf.paths.console.tmp));
}

function buildTemplates() {
  var _html = copyHtml(),
      _jade = buildJade();
  return merge(_html, _jade);
}
