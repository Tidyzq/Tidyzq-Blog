'use strict';

var log = require('debug')('boot:00-init-datasources');
var modelConfig = require('../model-config.json');

module.exports = function(app, done) {

  function getModels(sourceName) {
    var models = [];
    for (var model in modelConfig) {
      if (modelConfig[model].dataSource && modelConfig[model].dataSource === sourceName) {
        models.push(model);
      }
    }
    return models;
  }

  function initSource(sourceName, dataSource) {
    return new Promise(function(resolve, reject) {
      log('initializing source: ' + sourceName);

      var models = getModels(sourceName);

      log(sourceName, models);

      dataSource.isActual(models, function(err, actual) {
        if (err) {
          console.error('Error on initSource:', err);
          reject(err);
        } else {
          if (!actual) { // need update
            updateSource(sourceName, dataSource, models)
              .then(resolve, reject);
          } else { // don't need update
            log(sourceName + ' is already up to date');
            resolve();
          }
        }
      });
    });
  }

  function updateSource(sourceName, dataSource, models) {
    return new Promise(function(resolve, reject) {
      log('updating source: ' + sourceName);
      dataSource.autoupdate(models, function(err, result) {
        if (err) {
          console.error('Error on updateSource:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  var promises = [];

  for (var sourceName in app.dataSources) {
    // avoid repeatation
    // sice there will be a 'db' and 'Db'
    if (/^[a-z]/.test(sourceName)) {
      var dataSource = app.datasources[sourceName];
      promises.push(initSource(sourceName, dataSource));
    }
  }

  Promise.all(promises).then(function() { // finish
    done();
  }, console.error);

};
