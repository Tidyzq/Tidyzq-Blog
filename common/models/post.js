var _ = require('lodash');
var utils = require('loopback/lib/utils');
var overrideRemoteMethod = require('../utils/override-remote-method');

module.exports = function(Post) {

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
    Post.disableRemoteMethod(method.name, method.isStatic);
  });

  var isPost = {
    status: 'published',
    isPage: false
  };

  // override build-in find
  Post.remoteFind = function (filter, callback) {
    var Document = Post.app.models.document;
    filter = _.extend(filter, {
      where: isPost
    });
    return Document.find(filter, callback);
  };

  // override build-in findOne
  Post.remoteFindOne = function (filter, callback) {
    var Document = Post.app.models.document;
    filter = _.extend(filter, {
      where: _.extend(filter.where, isPost)
    });
    return Document.findOne(filter, callback);
  };

  // override build-in count
  Post.remoteCount = function (where, callback) {
    var Document = Post.app.models.document;
    where = _.extend(where, isPost);
    return Document.count(where, callback);
  };

  // override build in methods
  Post.on('attached',function () {

    overrideRemoteMethod(Post, 'find', Post.remoteFind);
    overrideRemoteMethod(Post, 'findOne', Post.remoteFindOne);
    overrideRemoteMethod(Post, 'count', Post.remoteCount);

  });

  // find by url
  Post.findByUrl = function(url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = _.extend(filter, {
      where: {
        url: url
      }
    });
    Post.remoteFindOne(filter, function (err, result) {
      if (!err && result) {
        callback(null, result);
      } else {
        var err1 = new Error('Unknown "post" url "' + url + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        callback(err || err1);
      }
    });
    return callback.promise;
  };

  Post.remoteMethod(
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
  Post.existsByUrl = function (url, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      }
    };
    Post.remoteFindOne(filter, function (err, result) {
      callback(err, !!result);
    });
    return callback.promise;
  };

  Post.remoteMethod(
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

  Post['__get__tags'] = function (url, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      },
      include: 'tags'
    };
    Post.remoteFindOne(filter, function (err, result) {
      console.log(result.tags());
      callback(err, err ? null : result.tags());
    });
    return callback.promise;
  };

  Post.remoteMethod(
    '__get__tags',
    {
      description: 'Queries tags of post.',
      accepts: [
        {arg: 'url', type: 'string', description:'Model url.', required: true}
      ],
      http: [
        {path: '/:url/tags', verb: 'get'},
      ],
      returns: {root: true, type: 'object'}
    }
  );

  Post['__count__tags'] = function (url, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      }
    };
    Post.remoteFindOne(filter, function (err, result) {
      if (!err && result) {
        result['__count__tags']({}, callback);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Post.remoteMethod(
    '__count__tags',
    {
      description: 'Counts tags of post.',
      accepts: [
        {arg: 'url', type: 'string', description:'Model url.', required: true}
      ],
      http: [
        {path: '/:url/tags/count', verb: 'get'},
      ],
      returns: {arg: 'count', type: 'number'}
    }
  );

  Post['__exists__tags'] = function (url, fk, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      }
    };
    Post.remoteFindOne(filter, function (err, result) {
      if (!err && result) {
        result['__count__tags'](fk, callback);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Post.remoteMethod(
    '__exists__tags',
    {
      description: 'Check the existence of tags relation to an item by url.',
      accepts: [
        {arg: 'url', type: 'string', description:'Model url.', required: true},
        {arg: 'fk', type: 'string', description:'Foreign key.', required: true},
      ],
      http: [
        {path: '/:url/tags/rel/:fk', verb: 'head'},
      ],
      returns: {root: true, type: 'object'}
    }
  );

};
