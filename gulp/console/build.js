// 'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var lazypipe = require('lazypipe');
var conf = require('../conf');

var $ = require('gulp-load-plugins')();

gulp.task('console:build', ['console:build:html', 'console:build:fonts']);

gulp.task('console:partials', ['console:templates'], function () {
    return gulp.src([
        path.join(conf.paths.console.tmp, '/**/*.html'),
        '!' + path.join(conf.paths.console.tmp, '/*.html')
      ])
      .pipe($.htmlmin({
          collapseWhitespace: true,
          maxLineLength     : 120,
          removeComments    : true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
          module: 'blog',
          root  : 'console'
      }))
      .pipe(gulp.dest(conf.paths.console.tmp));
});

gulp.task('console:build:html', ['console:inject', 'console:partials'], function() {
  var cssFilter = $.filter('**/*.css', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var htmlFilter = $.filter('**/*html', { restore: true });

  var partialsInjectFile = gulp.src(path.join(conf.paths.console.tmp, '/templateCacheHtml.js'), {read: false});
  var partialsInjectOptions = {
      starttag    : '<!-- inject:partials -->',
      ignorePath  : path.join(conf.paths.console.tmp),
      addRootSlash: false,
      addPrefix   : '/console'
  };

  return gulp.src(path.join(conf.paths.console.tmp, '/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
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
    // .pipe($.uglify()).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)

    .pipe(cssFilter)
    .pipe($.cssnano())
    .pipe($.rev())
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
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

gulp.task('console:build:fonts', function () {

  var fontFilter = $.filter('**/*.{eot,svg,ttf,woff,woff2}');

  return gulp.src(path.join(conf.paths.vendor, '/**/*.{eot,svg,ttf,woff,woff2}'))
    // .pipe($.mainBowerFiles())
    // .pipe(fontFilter)
    .pipe($.rename(function (filePath) {
      filePath.dirname = filePath.dirname.replace(/^.+fonts/, '');
    }))
    // .pipe($.print())
    // .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.console.dist, '/fonts/')));
});
