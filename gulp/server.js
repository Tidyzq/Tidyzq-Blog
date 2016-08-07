'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var nodemon = require('nodemon');

var browserSync = require('browser-sync');
// var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

gulp.task('serve', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        port: 7000,
        notify: false
    });
});

gulp.task('nodemon', function(done) {

    var started = false;

    process.env.FAKE = 1;

    return nodemon({
        script: 'server/server.js',
        ignore: [
            'client/**',
            'gulp/**',
            'node_modules/**',
            'test/**',
            './*'
        ],
        stdout: false
    }).on('readable', function() {
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    }).on('stdout', function(msg) {
        if (!started && /^Web server listening at:/.test(msg)) {
            started = true;
            done();
        }
    });
});

