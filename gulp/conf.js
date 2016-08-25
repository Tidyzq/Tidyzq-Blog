/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

/**
 *  The main paths of your project handle these with care
 */

exports.paths = {
    src : 'client/console/src',
    tmp : 'client/console/.tmp',
    doc : 'client/docs',
    vendor : '../..',
    server: 'server/server.js',
    lbServices: 'lb-services.js',
    models: 'common/models'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
    directory: 'client/vendor'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
