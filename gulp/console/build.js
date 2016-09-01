// 'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var lazypipe = require('lazypipe');
var conf = require('../conf');

var $ = require('gulp-load-plugins')();

gulp.task('console:build', ['console:inject'], function() {
  var cssFilter = $.filter('**/*.css', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var htmlFilter = $.filter('**/*html', { restore: true });

  return gulp.src(path.join(conf.paths.console.tmp, '/*.html'))
    .pipe($.useref({
      searchPath: conf.paths.client,
      transformPath: function(filePath) {
        return filePath.replace('console', 'console/.tmp');
      }
    }))
    // .pipe($.size({
        // showFiles: true
    // }))
    .pipe($.rename(function (filePath) {
      filePath.dirname = filePath.dirname.replace('console/', '');
    }))
    // .pipe($.print())
    .pipe(jsFilter)
    // .pipe($.sourcemaps.init())
    // .pipe($.ngAnnotate())
    .pipe($.uglify()).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe(cssFilter.restore)
    // .pipe($.revReplace())
    // .pipe(htmlFilter)
    // .pipe($.htmlmin({
    //     collapseWhitespace: true,
    //     maxLineLength     : 120,
    //     removeComments    : true
    // }))
    // .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.console.dist, '/')))
    .pipe($.size({
        title    : path.join(conf.paths.console.dist, '/'),
        showFiles: true
    }));
});
