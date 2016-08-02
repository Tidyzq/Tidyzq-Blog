module.exports = function(Todo) {

  var disabledMethods = [
    // { name: 'updateAll',          isStatic: true },
    { name: 'createChangeStream', isStatic: true }
  ];

  var readOnlyProperties = [
    'ownerId',
    'createdDate',
    'modifiedDate'
  ];

  disabledMethods.forEach(function (method) {
    Todo.disableRemoteMethod(method.name, method.isStatic);
  });

  // set owner id
  Todo.beforeRemote('create', function(context, modelInstance, next) {
    // console.log(context.args);
    context.args.data.ownerId = context.req.accessToken.userId;
    next();
  });

  // set create date and modified date
  Todo.observe('before save', function(context, next) {
    // console.log('isNewInstance:', context.isNewInstance);
    if (context.isNewInstance) {
      context.instance.createdDate = context.instance.modifiedDate = new Date();
    } else {
      readOnlyProperties.forEach(function(property) {
        delete context.data[property];
      });
      context.data.modifiedDate = new Date();
    }
    next();
  });
};
