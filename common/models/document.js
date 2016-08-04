var _ = require('lodash');
var marked = require('marked');
var katex = require('katex');

marked.setOptions({
  math: function(text) {
    try {
      return katex.renderToString(text, { displayMode: true });
    } catch (error) {
      return error.message;
    }
  },
  inlineMath: function(text) {
    try {
      return katex.renderToString(text, { displayMode: false });
    } catch (error) {
      return error.message;
    }
  }
});

module.exports = function(Document) {

  var disabledMethods = [
    { name: 'createChangeStream', isStatic: true }
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
    if (context.isNewInstance) {
      context.instance.html = marked(context.instance.markdown);

      // if url not set
      if (!context.instance.url) {
        context.instance.url = encodeURI(context.instance.title);
      }

    } else {
      // if markdown changes
      if (context.data.markdown) {
        context.data.html = marked(context.data.markdown);
      }
    }
    next();
  });

  Document.publish = function (credentials, cb) {
    var Page = User.app.models.Page;
    Document.updateAttribute({
      id: credentials.id,
      status: 'published'
    }, function(err, post) {
      cb(err, post);
    });
  }

  Document.remoteMethod(
    'publish',
    {
      description: 'Publish a post',
      accepts: {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      http: {path: '/publish', verb: 'post'},
      returns: {root:true, type: 'object'}
    }
  );

  Document.unpublish = function (credentials, cb) {
    var Page = User.app.models.Page;
    Document.updateAttribute({
      id: credentials.id,
      status: 'draft'
    }, function(err, post) {
      cb(err, post);
    });
  }

  Document.remoteMethod(
    'unpublish',
    {
      description: 'Unpublish a post',
      accepts: {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      http: {path: '/unpublish', verb: 'post'},
      returns: {root:true, type: 'object'}
    }
  );


};
