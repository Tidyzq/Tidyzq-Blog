var _ = require('lodash');
var utils = require('loopback/lib/utils');
var marked = require('../utils/render-markdown');
var generateUrl = require('../utils/generate-url');

module.exports = function(Document) {

  Document.validatesInclusionOf('status', {
    in: ['published', 'draft']
  });

  var disabledMethods = [
    { name: 'createChangeStream', isStatic: true },
    { name: '__delete__tags', isStatic: false }
  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    Document.disableRemoteMethod(method.name, method.isStatic);
  });

  // set author id
  Document.beforeRemote('create', function(context, modelInstance, next) {
    // console.log(context.args);
    context.args.data.authorId = context.req.accessToken.userId;
    next();
  });

  // set updater id
  Document.beforeRemote('updateAttribute', function(context, modelInstance, next) {
    // console.log(context.args);
    context.args.data.updater = context.req.accessToken.userId;
    next();
  });

  var $now = function() {
    return new Date();
  };

  // set default value for date
  Document.definition.rawProperties.createdAt.default = $now;
  Document.definition.properties.createdAt.default = $now;
  Document.definition.rawProperties.updatedAt.default = $now;
  Document.definition.properties.updatedAt.default = $now;

  // set create date and modified date
  Document.observe('before save', function(context, next) {
    var wait = false;
    if (context.isNewInstance) {
      context.instance.html = marked(context.instance.markdown);

      // if url not set
      if (!context.instance.url) {
        wait = true;
        generateUrl(Document, context.instance.title)
          .then(function (url) {
            context.instance.url = url;
            next();
          }, console.error);
      }

    } else {
      // if markdown changes
      if (context.data.markdown) {
        context.data.html = marked(context.data.markdown);
      }
    }
    if (!wait) next();
  });

  Document.findByUrl = function (url, filter, callback) {
    callback = callback || utils.createPromiseCallback();
    filter = _.extend(filter, {
      where: {
        url: url
      }
    });
    Document.findOne(filter, function (err, result) {
      if (!err && result) {
        callback(null, result);
      } else {
        var err1 = new Error('Unknown "document" url "' + url + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        callback(err || err1);
      }
    });
    return callback.promise;
  };

  Document.remoteMethod(
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
