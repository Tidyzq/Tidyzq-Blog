var _ = require('lodash');

module.exports = function(Page) {

  var disabledMethods = [
    { name: 'createChangeStream', isStatic: true },
    { name: 'create', isStatic: true },
    { name: 'deleteById', isStatic: true },
    { name: 'updateAttribute', isStatic: true },
    { name: 'updateAll', isStatic: true },
    { name: 'upsert', isStatic: true }
  ];

  disabledMethods.forEach(function (method) {
    Page.disableRemoteMethod(method.name, method.isStatic);
  });

  // // set author id
  // Post.beforeRemote('create', function(context, modelInstance, next) {
  //   // console.log(context.args);
  //   context.args.data.authorId = context.req.accessToken.userId;
  //   next();
  // });

  // // set updater id
  // Post.beforeRemote('create', function(context, modelInstance, next) {
  //   // console.log(context.args);
  //   context.args.data.authorId = context.req.accessToken.userId;
  //   next();
  // });

  // // set create date and modified date
  // Post.observe('before save', function(context, next) {
  //   // console.log('isNewInstance:', context.isNewInstance);
  //   if (context.isNewInstance) {
  //     context.instance.createdDate = context.instance.modifiedDate = new Date();
  //   } else {
  //     context.data = _.omit(context.data, readOnlyProperties);

  //     context.data.modifiedDate = new Date();
  //   }
  //   next();
  // });

  // override find method
  Page.find = function (filter, cb) {
    var Post = Page.app.models.post;
    _.extend(filter, {
      where: {
        status: 'published',
        isPage: true
      }
    });
    return Post.findAll(filter, cb);
  }
};
