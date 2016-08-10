'use strict';

var log = require('debug')('boot:99-fake-data');
var modelConfig = require('../model-config.json');
var faker = require('faker');
var _ = require('lodash');

module.exports = function(app, done) {

  // exit if FAKE not set
  if (!process.env.FAKE) {
    done();
    return;
  }

  // 用于在某个model的id中随机的拓展
  function $fakeModelId (modelName, callback) {
    var model = app.models[modelName];
    var idName = model.getIdName();
    model.find({}, function (err, results) {
      if (!err) {
        var ids = results.map(function (item) {
          return item[idName];
        });
        var method = Function.prototype.bind.apply(faker.random.arrayElement, [null, ids]);
        callback(method);
      } else {
        log(err);
      }
    });
  }

  // 根据json文件中的properties, 生成fake方法
  function getFakeMethod(properties, callback) {

    var structure = {};

    var keys = _.keys(properties),
        callbacks = [];

    keys.forEach(function (property, index) {
      callbacks[index] = function () {
        var methodDef = properties[property];
        if (methodDef) {
          // 如果是字符串, 则直接绑定faker中对应的函数
          if (typeof methodDef === 'string') {
            structure[property] = _.get(faker, methodDef);
            callbacks[index + 1]();
          // if defintion is an array
          // 则 [0] 视为faker的方法路径, 之后的全部视为传给faker方法的参数
          } else if (_.isArray(methodDef) && methodDef[0] !== '$fakeModelId') {
            var method = _.get(faker, methodDef[0]),
                args = [null];
            for (var i = 1; i < methodDef.length; ++i) {
              args.push(methodDef[i]);
            }
            structure[property] = Function.prototype.bind.apply(method, args); // bind arguments
            callbacks[index + 1]();
          // 如果是array并且方法路径是$fakeModelId
          // 则调用fakeModelId
          // 然后将返回的方法绑定
          } else if (_.isArray(methodDef) && methodDef[0] === '$fakeModelId') {
            $fakeModelId(methodDef[1], function (method) {
              structure[property] = method;
              callbacks[index + 1]();
            });
          }
        }
      };
    });

    // 当全部产生完成后, 返回fake方法
    callbacks[keys.length] = function () {
      callback(function() {
        var data = {};
        for (var key in structure) {
          data[key] = structure[key]();
        }
        return data;
      });
    };

    callbacks[0]();

  }


  // 根据传入的count递归插入伪数据
  function createData(model, count, fakeMethod, done) {

      var recursion = function (curCount) {
        if (curCount === count) {
          done();
          return;
        } else {
          model.create(fakeMethod(), function (err, result) {
            if (err) {
              // log(err);
              return recursion(curCount);
            } else {
              return recursion(curCount + 1);
            }
          });
        }
      };

      recursion(0);

  }

  // 生成伪数据的主要过程, 首先获取fake方法
  // 然后根据数量计算是否需要执行createDate
  function generateFake(config, done) {

    log('generateFake(' + config.modelName + ')');

    var model = app.models[config.modelName];

    getFakeMethod(config.properties, function (fakeMethod) {

      model.count(function(err, count){
        if (err) {
          reject('Error on fakeModel: ' + err);
        } else {
          if (count < config.count) {
            log('faking ' + config.modelName);
            createData(model, config.count - count, fakeMethod, done);
          } else {
            log(config.modelName + ' already have ' + count + '/' + config.count + ' models');
            done();
          }
        }
      });

    });

  }

  var callbacks = [];

  var priorityQueue = [];

  // 优先队列
  // 用于将不同优先级的fake分批执行
  for (var modelName in modelConfig) {
    var fakeConfig = modelConfig[modelName].faker;
    if (fakeConfig) {

      var priority = fakeConfig.priority || 0;
      if (!_.isArray(priorityQueue[priority])) {
        priorityQueue[priority] = [];
      }
      priorityQueue[priority].push(_.extend(fakeConfig, {
        modelName: modelName
      }));
    }
  }

  // 对于每一个队列, 先对其中每一个元素执行generateFake
  // 当调用了一定次数的done之后, 进入下一优先级
  priorityQueue.forEach(function (queue, index) {
    callbacks[index] = function () {
      log('priority:' + index);
      if (queue.length === 0) {
        callbacks[index + 1]();
        return;
      }
      var counter = 0;
      var done = function() {
        counter += 1;
        if (counter === queue.length) {
          callbacks[index + 1]();
        }
      };
      queue.forEach(function (item) {
        generateFake(item, done);
      });
    };
  });

  callbacks[priorityQueue.length] = done;

  callbacks[0]();

};
