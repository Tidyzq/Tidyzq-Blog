var generateUrl = require('../utils/generate-url');
var utils = require('loopback/lib/utils');
var _ = require('lodash');

module.exports = function(Tag) {

  var disabledMethods = [
    {name: '__create__documents', isStatic: false},
    {name: '__delete__documents', isStatic: false},
    {name: '__findById__documents', isStatic: false},
    {name: '__updateById__documents', isStatic: false},
    {name: '__destroyById__documents', isStatic: false},
    {name: '__link__documents', isStatic: false},
    {name: '__unlink__documents', isStatic: false}
  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    Tag.disableRemoteMethod(method.name, method.isStatic);
  });

  // generate url before save
  Tag.observe('before save', function(context, next) {
    var wait = false;
    if (context.isNewInstance) {

      // if url not set
      if (!context.instance.url) {
        wait = true;
        generateUrl(Tag, context.instance.name)
          .then(function (url) {
            context.instance.url = url;
            next();
          }, console.error);
      }

    }
    if (!wait) next();
  });

  Tag.findByUrl = function (url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = _.extend(filter, {
      where: {
        url: url
      }
    });
    Tag.findOne(filter, function (err, result) {
      if (!err && result) {
        callback(null, result);
      } else {
        var err1 = new Error('Unknown "tag" url "' + url + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        callback(err || err1);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    'findByUrl',
    {
      description: 'Find a model instance by url from the data source.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'filter', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/url/:url', verb: 'get'},
      returns: {root: true, type: 'object'}
    }
  );

  Tag.existsByUrl = function (url, callback) {
    callback = callback || utils.createPromiseCallback();
    var filter = {
      where: {
        url: url
      }
    };
    Tag.findOne(filter, function (err, result) {
      callback(err, !!result);
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    'existsByUrl',
    {
      description: 'Check whether a model instance exists in the data source.',
      accepts: [
        {arg: 'url', type: 'string', description:'Model url.', required: true}
      ],
      http: [
        {path: '/url/:url/exists', verb: 'get'},
        {path: '/url/:url', verb: 'head'}
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

  var isPost = {
    status: 'published',
    isPage: false
  };

  var isPage = {
    status: 'published',
    isPage: true
  };

  Tag['__get__posts'] = function (url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = filter || {};
    filter.where = _.extend(filter.where, isPost);
    Tag.findByUrl(url, {}, function (err, result) {
      if (!err && result) {
        result['__get__documents'](filter, callback);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__get__posts',
    {
      description: 'Queries posts of tag.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'filter', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/url/:url/posts', verb: 'get'},
      returns: {root: true, type: 'object'}
    }
  );

  Tag['__get__pages'] = function (url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = filter || {};
    filter.where = _.extend(filter.where, isPage);
    Tag.findByUrl(url, {}, function (err, result) {
      if (!err && result) {
        result['__get__documents'](filter, callback);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__get__pages',
    {
      description: 'Queries pages of tag.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'filter', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/url/:url/pages', verb: 'get'},
      returns: {root: true, type: 'object'}
    }
  );

  Tag['__count__posts'] = function (url, where, callback) {
    callback = callback || utils.createPromiseCallback();
    Tag['__get__posts'](url, where, function (err, result) {
      if (!err && result) {
        callback(null, result.length);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__count__posts',
    {
      description: 'Count posts of tag.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'where', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/url/:url/posts/count', verb: 'get'},
      returns: {arg: 'count', type: 'number'}
    }
  );

  Tag['__count__pages'] = function (url, where, callback) {
    callback = callback || utils.createPromiseCallback();
    Tag['__get__pages'](url, where, function (err, result) {
      if (!err && result) {
        callback(null, result.length);
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__count__pages',
    {
      description: 'Count pages of tag.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'where', type: 'object', http: {source: 'query'}}
      ],
      http: {path: '/url/:url/pages/count', verb: 'get'},
      returns: {arg: 'count', type: 'number'}
    }
  );

  Tag['__exists__posts'] = function (url, fk, callback) {
    callback = callback || utils.createPromiseCallback();
    Tag.findByUrl(url, {}, function (err, result) {
      if (!err && result) {
        result['__findById__documents'](fk, {}, function (err, result) {
          if (!err && result && _.isMatch(result, isPost)) {
            callback();
          } else {
            var error = new Error('Unknown "post" id "' + fk + '".');
            error.statusCode = error.status = 404;
            error.code = 'MODEL_NOT_FOUND';
            callback(err || error);
          }
        });
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__exists__posts',
    {
      description: 'Check the existence of posts relation to an item by id.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'fk', type: 'string', required: true}
      ],
      http: {path: '/url/:url/posts/rel/:fk', verb: 'head'},
      returns: {root: true, type: 'object'}
    }
  );

  Tag['__exists__pages'] = function (url, fk, callback) {
    callback = callback || utils.createPromiseCallback();
    Tag.findByUrl(url, {}, function (err, result) {
      if (!err && result) {
        result['__findById__documents'](fk, {}, function (err, result) {
          if (!err && result && _.isMatch(result, isPage)) {
            callback();
          } else {
            var error = new Error('Unknown "page" id "' + fk + '".');
            error.statusCode = error.status = 404;
            error.code = 'MODEL_NOT_FOUND';
            callback(err || error);
          }
        });
      } else {
        callback(err);
      }
    });
    return callback.promise;
  };

  Tag.remoteMethod(
    '__exists__pages',
    {
      description: 'Check the existence of pages relation to an item by id.',
      accepts: [
        {arg: 'url', type: 'string', required: true},
        {arg: 'fk', type: 'string', required: true}
      ],
      http: {path: '/url/:url/pages/rel/:fk', verb: 'head'},
      returns: {root: true, type: 'object'}
    }
  );

};
