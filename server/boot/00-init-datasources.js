'use strict';

var log = require('debug')('boot:00-init-datasources');
var modelConfig = require('../model-config.json');

module.exports = function(app, done) {

  var migrate = !!process.env.INIT;

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

      if (dataSource.connected) {
        onSourceConnected(sourceName, dataSource)
          .then(resolve, reject);
      } else {
        log('connecting ' + sourceName);
        dataSource.once('connected', function() {
          onSourceConnected(sourceName, dataSource)
            .then(resolve, reject);
        });
      }
    });
  }

  function onSourceConnected(sourceName, dataSource) {
    return new Promise(function(resolve, reject) {
      log(sourceName + ' connected');

      var models = getModels(sourceName);

      log(sourceName, models);

      migrate ?

      migrateSource(sourceName, dataSource, models)
        .then(resolve, reject) :

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

  function migrateSource(sourceName, dataSource, models) {
    return new Promise(function(resolve, reject) {
      log('migrating source: ' + sourceName);
      dataSource.automigrate(models, function(err, result) {
        if (err) {
          console.error('Error on updateSource:', err);
          reject(err);
        } else {
          resolve();
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
    log('done');
    done();
  }, console.error);

};
