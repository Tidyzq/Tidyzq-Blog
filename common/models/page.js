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
    { name: 'upsert',             isStatic: true }
  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    Page.disableRemoteMethod(method.name, method.isStatic);
  });

  var isPage = {
    status: 'published',
    isPage: true
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
      where: isPage
    });
    return Document.findOne(filter, callback);
  };

  // override build-in findById
  Page.remoteFindById = function (id, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    var Document = Page.app.models.document;
    Document.findById(id, filter, function(err, post) {
      if (!err && _.isMatch(post, isPage)) {
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
  Page.remoteCount = function (where, callback) {
    var Document = Page.app.models.document;
    where = _.extend(where, isPage);
    return Document.count(where, callback);
  };

  // override build-in exists
  Page.remoteExists = function (id, callback) {
    callback = callback || utils.createPromiseCallback();
    var Document = Page.app.models.document;
    Document.findById(id, {}, function(err, post) {
      if (!err && _.isMatch(post, isPage)) {
        callback(null, true);
      } else {
        callback(err, false);
      }
    });
    return callback.promise;
  };

  // override build in methods
  Page.on('attached',function () {

    overrideRemoteMethod(Page, 'find', Page.remoteFind);
    overrideRemoteMethod(Page, 'findOne', Page.remoteFindOne);
    overrideRemoteMethod(Page, 'findById', Page.remoteFindById);
    overrideRemoteMethod(Page, 'count', Page.remoteCount);
    overrideRemoteMethod(Page, 'exists', Page.remoteExists);

  });

};
