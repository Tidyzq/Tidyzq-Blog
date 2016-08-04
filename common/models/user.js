module.exports = function(User) {
  User.validatesFormatOf('username', {
    with: /^[\w\.]+$/,
    message: 'username can only contains alphanumeric characters, underscores and dots.' });

  // add get role method to User
  User.getRolesById = function (id, cb) {
    var RoleMapping = User.app.models.RoleMapping;
    RoleMapping.find({
      principalType: RoleMapping.USER,
      principalId: id,
      include: 'role'
    }, function(err, results) {
      var roles = [];
      console.log(results);
      if (!err) {
        roles = results.map(function(roleMapping) {
          // console.log(roleMapping.role());
          return roleMapping.role().name;
        });
      }
      cb(err, roles);
    });
  }

  User.remoteMethod(
    'getRolesById',
    {
      description: 'Get roles for a user',
      accepts: { arg: 'id', type: 'integer', required: true },
      http: {path: '/:id/roles', verb: 'get'},
      returns: {root:true, type: 'object'}
    }
  );

};
