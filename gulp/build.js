'use strict';

var path = require('path');
var gulp = require('gulp');
var merge = require('merge-stream');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('build', ['console:build', 'blog:build']);
