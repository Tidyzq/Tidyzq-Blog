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
    { name: 'upsert',             isStatic: true }
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
      where: isPost
    });
    return Document.findOne(filter, callback);
  };

  // override build-in findById
  Post.remoteFindById = function (id, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    var Document = Post.app.models.document;
    Document.findById(id, filter, function(err, post) {
      if (!err && _.isMatch(post, isPost)) {
        callback(null, post);
      } else {
        var err1 = new Error('Unknown "post" id "' + id + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        callback(err || err1);
      }
    });
    return callback.promise;
  };

  // override build-in count
  Post.remoteCount = function (where, callback) {
    var Document = Post.app.models.document;
    where = _.extend(where, isPost);
    return Document.count(where, callback);
  };

  // override build-in exists
  Post.remoteExists = function (id, callback) {
    callback = callback || utils.createPromiseCallback();
    var Document = Post.app.models.document;
    Document.findById(id, {}, function(err, post) {
      if (!err && _.isMatch(post, isPost)) {
        callback(null, true);
      } else {
        callback(err, false);
      }
    });
    return callback.promise;
  };

  // override build in methods
  Post.on('attached',function () {

    overrideRemoteMethod(Post, 'find', Post.remoteFind);
    overrideRemoteMethod(Post, 'findOne', Post.remoteFindOne);
    overrideRemoteMethod(Post, 'findById', Post.remoteFindById);
    overrideRemoteMethod(Post, 'count', Post.remoteCount);
    overrideRemoteMethod(Post, 'exists', Post.remoteExists);

  });

};
