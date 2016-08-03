'use strict';

var log = require('debug')('boot:99-fake-data');
var modelConfig = require('../model-config.json');
var faker = require('faker');

module.exports = function(app, done) {

  // exit if FAKE not set
  if (!process.env.FAKE) {
    done();
    return;
  }

  function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
  }

  function getFakeMethod(properties) {
    var structure = {};

    for (var property in properties) {
      var methodDef = properties[property],
          fakeMethod;
      if (methodDef) {
        log(methodDef);
        if (typeof methodDef === 'string') {
          fakeMethod = getDescendantProp(faker, methodDef);
        } else if (typeof methodDef === 'object' && Array.isArray(methodDef) && methodDef[0]) {
          var method = getDescendantProp(faker, methodDef[0]),
              args = [null];
          for (var i = 1; i < methodDef.length; ++i) {
            args.push(methodDef[i]);
          }
          fakeMethod = Function.prototype.bind.apply(method, args);
        }
      }
      structure[property] = fakeMethod;
    }

    return function() {
      var data = {};
      for (var key in structure) {
        data[key] = structure[key]();
      }
      return data;
    }
  }

  function createData(model, count, fakeMethod) {
    return new Promise(function(resolve, reject) {

      var data = [];

      for (var i = 0; i < count; ++i) {
        data.push(fakeMethod());
      }

      model.create(data, function(err, models) {
        if (err) {
          reject('Error on fakeModel: ' + err);
        } else {
          log('created data:', models);
          resolve();
        }
      });
    });
  }

  function fakeModel(modelName, fakeConfig) {
    return new Promise(function(resolve, reject) {

      var model = app.models[modelName];

      var fakeMethod = getFakeMethod(fakeConfig.properties);

      model.count(function(err, count){
        if (err) {
          reject('Error on fakeModel: ' + err);
        } else {
          if (count < fakeConfig.count) {
            log('faking ' + modelName);
            createData(model, fakeConfig.count - count, fakeMethod)
              .then(resolve, reject);
          } else {
            log(modelName + ' already have ' + count + '/' + fakeConfig.count + ' models');
            resolve();
          }
        }
      });
    });
  }

  var promises = [];

  for (var modelName in modelConfig) {
    var fakeConfig = modelConfig[modelName].faker;
    if (fakeConfig) {
      promises.push(fakeModel(modelName, fakeConfig));
    }
  }

  Promise.all(promises).then(function() { // finish
    log('done');
    done();
  }, console.error);

};
