var generateUrl = require('../utils/generate-url');
var utils = require('loopback/lib/utils');
var _ = require('lodash');

module.exports = function(Tag) {

  Tag.validatesUniquenessOf('url');

  var disabledMethods = [

  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    Tag.disableRemoteMethod(method.name, method.isStatic);
  });

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
};
