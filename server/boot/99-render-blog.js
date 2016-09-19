'use strict';

var log = require('debug')('boot:99-render-blog');

module.exports = function(app, done) {

  var Render = app.models.render;

  log('Rendering blog');

  Render
    .renderAll()
    .then(function () {
      log('done');
      done();
    })
    .catch(function (err) {
      console.error(err);
    });

};
