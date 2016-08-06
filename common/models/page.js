var _ = require('lodash');
var utils = require('loopback/lib/utils');
var overrideRemoteMethod = require('../utils/override-remote-method');

module.exports = function(Page) {

  var disabledMethods = [
    { name: 'createChangeStream', isStatic: true },
    { name: 'create',             isStatic: true },
    { name: 'createMany',         isStatic: true },
    { name: 'deleteById',         isStatic: true },
    { name: 'updateAttribute',    isStatic: true },
    { name: 'updateAttributes',   isStatic: false },
    { name: 'updateAll',          isStatic: true },
    { name: 'upsert',             isStatic: true },
    { name: 'findById',           isStatic: true },
    { name: 'exists',             isStatic: true }
  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    Page.disableRemoteMethod(method.name, method.isStatic);
  });

  var isPage = {
    status: 'published',
    isPage: false
  };

  // override build-in find
  Page.remoteFind = function (filter, callback) {
    var Document = Page.app.models.document;
    filter = _.extend(filter, {
      where: isPage
    });
    return Document.find(filter, callback);
  };

  // override build-in findOne
  Page.remoteFindOne = function (filter, callback) {
    var Document = Page.app.models.document;
    filter = _.extend(filter, {
      where: _.extend(filter.where, isPage)
    });
    return Document.findOne(filter, callback);
  };

  // override build-in count
  Page.remoteCount = function (where, callback) {
    var Document = Page.app.models.document;
    where = _.extend(where, isPage);
    return Document.count(where, callback);
  };

  // override build in methods
  Page.on('attached',function () {

    overrideRemoteMethod(Page, 'find', Page.remoteFind);
    overrideRemoteMethod(Page, 'findOne', Page.remoteFindOne);
    overrideRemoteMethod(Page, 'count', Page.remoteCount);

  });

  // find by url
  Page.findByUrl = function(url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = _.extend(filter, {
      where: {
        url: url
      }
    });
    Page.remoteFindOne(filter, function (err, result) {
      if (!err && result) {
        callback(null, result);
      } else {
        var err1 = new Error('Unknown "page" url "' + url + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        callback(err || err1);
      }
    })
    return callback.promise;
  };

  Page.remoteMethod(
    'findByUrl',
    {
      description: 'Find a model instance by url from the data source.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'filter', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/:url', verb: 'get'},
      returns: {root: true, type: 'object'}
    }
  );

  // exists by url
  Page.existsByUrl = function (url, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      }
    };
    Page.remoteFindOne(filter, function (err, result) {
      callback(err, !!result);
    });
    return callback.promise;
  };

  Page.remoteMethod(
    'existsByUrl',
    {
      description: 'Check whether a model instance exists in the data source.',
      accepts: [
        {arg: 'url', type: 'string', description:'Model url.', required: true}
      ],
      http: [
        {path: '/:url/exists', verb: 'get'},
        {path: '/:url', verb: 'head'}
      ],
      returns: {arg: 'exists', type: 'boolean'},
      rest: {
        // After hook to map exists to 200/404 for HEAD
        after: function(ctx, cb) {
          if (ctx.req.method === 'GET') {
            // For GET, return {exists: true|false} as is
            return cb();
          }
          if (!ctx.result.exists) {
            var modelName = ctx.method.sharedClass.name;
            var id = ctx.getArgByName('id');
            var msg = 'Unknown "' + modelName + '" id "' + id + '".';
            var error = new Error(msg);
            error.statusCode = error.status = 404;
            error.code = 'MODEL_NOT_FOUND';
            cb(error);
          } else {
            cb();
          }
        }
      }
    }
  );

};
