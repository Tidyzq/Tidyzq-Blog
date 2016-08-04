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

module.exports = function(Post) {

  var disabledMethods = [
    { name: 'createChangeStream', isStatic: true }
  ];

  // var readOnlyProperties = [
  //   'html',
  //   'status',
  //   'authorId',
  //   'updatedBy',
  //   'createdAt',
  //   'updatedAt'
  // ];

  disabledMethods.forEach(function (method) {
    Post.disableRemoteMethod(method.name, method.isStatic);
  });

  // set author id
  Post.beforeRemote('create', function(context, modelInstance, next) {
    // console.log(context.args);
    context.args.data.authorId = context.req.accessToken.userId;
    next();
  });

  // // set updater id
  // Post.beforeRemote('create', function(context, modelInstance, next) {
  //   // console.log(context.args);
  //   context.args.data.authorId = context.req.accessToken.userId;
  //   next();
  // });

  var $now = function() {
    return new Date();
  };

  // set default value for date
  Post.definition.rawProperties.createdAt.default = $now;
  Post.definition.properties.createdAt.default = $now;
  Post.definition.rawProperties.updatedAt.default = $now;
  Post.definition.properties.updatedAt.default = $now;

  // set create date and modified date
  Post.observe('before save', function(context, next) {
    // console.log('isNewInstance:', context.isNewInstance);
    if (context.isNewInstance) {
      context.instance.html = marked(context.instance.markdown);

      if (!context.instance.url) {
        context.instance.url = encodeURI(context.instance.title);
      }

    } else {
      // context.data = _.omit(context.data, readOnlyProperties);

      // context.data.modifiedDate = new Date();
      if (context.data) {
        context.data.html = marked(context.data.markdown);
      }
    }
    next();
  });

  // override find method
  Post.findAll = Post.find;
  Post.find = function (filter, cb) {
    _.extend(filter, {
      where: {
        status: 'published',
        isPage: false
      }
    });
    return Post.findAll(filter, cb);
  }

  Post.remoteMethod(
    'findAll',
    {
      description: 'Find all posts include drafts and pages',
      accepts: {arg: 'filter', type: 'object', http: {source: 'query'}},
      http: {path: '/all', verb: 'get'},
      returns: {root:true, type: 'object'}
    }
  );

  Post.publish = function (credentials, cb) {
    var Page = User.app.models.Page;
    Post.updateAttribute({
      id: credentials.id,
      status: 'published'
    }, function(err, post) {
      cb(err, post);
    });
  }

  Post.remoteMethod(
    'publish',
    {
      description: 'Publish a post',
      accepts: {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      http: {path: '/publish', verb: 'post'},
      returns: {root:true, type: 'object'}
    }
  );

  Post.unpublish = function (credentials, cb) {
    var Page = User.app.models.Page;
    Post.updateAttribute({
      id: credentials.id,
      status: 'draft'
    }, function(err, post) {
      cb(err, post);
    });
  }

  Post.remoteMethod(
    'unpublish',
    {
      description: 'Unpublish a post',
      accepts: {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      http: {path: '/unpublish', verb: 'post'},
      returns: {root:true, type: 'object'}
    }
  );


};
