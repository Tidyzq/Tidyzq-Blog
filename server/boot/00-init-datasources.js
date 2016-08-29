'use strict';

var log = require('debug')('boot:00-init-datasources');

module.exports = function(app, done) {

  // whether to clear the data base
  var migrate = !!process.env.INIT;

  function autoMigrateModel(model) {

    log('auto migrating "' + model.modelName + '" in ' + model.dataSource.name);

    return model.dataSource.automigrate(model.modelName);

  }

  function autoUpdateModel(model) {

    log('auto updating "' + model.modelName + '" in ' + model.dataSource.name);

    // check if schema needs to be update
    return new Promise(function (resolve, reject) {
      model.dataSource.isActual(model.modelName, function (err, actual) {
        if (err) {
          reject(err);
        } else {
          if (!actual) { // need update
            resolve(model.dataSource.autoupdate(model));

          } else { // do not need update
            log(model.definition.name + ' is already up to date');
          }
          resolve();
        }
      });
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

  app.models().forEach(function (model) {
    promises.push(initModel(model));
  });

  Promise.all(promises)
    .then(function() { // finish
      log('done');
      done();
    })
    .catch(function (err) {
      console.error(err.stack);
    });

};
