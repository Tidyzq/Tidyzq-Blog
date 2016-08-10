'use strict';

var log = require('debug')('boot:00-init-datasources');

module.exports = function(app, done) {

  var migrate = !!process.env.INIT;

  function autoMigrateModel(model) {
    return new Promise(function(resolve, reject) {
      log('auto migrating "' + model.modelName + '" in ' + model.dataSource.name);
      model.dataSource.automigrate(model.modelName, function(err, result) {
        if (err) {
          console.error('Error on autoMigrateModel:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  function autoUpdateModel(model) {
    return new Promise(function(resolve, reject) {
      log('auto migrating "' + model.modelName + '" in ' + model.dataSource.name);
      model.dataSource.isActual(model.modelName, function(err, actual) {
        if (err) {
          console.error('Error on initSource:', err);
          reject(err);
        } else {
          resolve(!actual);
        }
      });
    }).then(function(needUpdate) {
      if (needUpdate) { // need update
        model.dataSource.autoupdate(model, function(err, result) {
          if (err) {
            console.error('Error on autoUpdateModel:', err);
            throw err;
          } else {
            return result;
          }
        });
      } else { // don't need update
        log(model.definition.name + ' is already up to date');
      }
    });
  }

  function initModel(model) {
    if (model.dataSource) {
        return migrate ? autoMigrateModel(model)
                       : autoUpdateModel(model);
    }
    return Promise.resolve();
  }

  var promises = [];

  // for (var sourceName in app.dataSources) {
  //   // avoid repeatation
  //   // sice there will be a 'db' and 'Db'
  //   if (/^[a-z]/.test(sourceName)) {
  //     var dataSource = app.datasources[sourceName];
  //     promises.push(initSource(sourceName, dataSource));
  //   }
  // }

  app.models().forEach(function (model) {
    promises.push(initModel(model));
  });

  Promise.all(promises).then(function() { // finish
    log('done');
    done();
  }, function (err) {
    console.error(err.stack);
  });

};
