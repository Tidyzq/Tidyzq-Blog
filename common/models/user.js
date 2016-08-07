var utils = require('loopback/lib/utils');
var _ = require('lodash');

module.exports = function(User) {

  var disabledMethods = [
    {name: '__get__accessTokens', isStatic: false}
  ];

  // disable remote methods
  disabledMethods.forEach(function (method) {
    User.disableRemoteMethod(method.name, method.isStatic);
  });

  User.validatesFormatOf('username', {
    with: /^[\w\.]+$/,
    message: 'username can only contains alphanumeric characters, underscores and dots.' });

  // add get role method to User
  User.prototype.getRolesById = function (cb) {
    cb = cb || utils.createPromiseCallback();
    var RoleMapping = User.app.models.RoleMapping,
        user = this;
    RoleMapping.find({
      where: {
        principalType: RoleMapping.USER,
        principalId: user.id,
      },
      include: 'role'
    }, function(err, results) {
      var roles = [];
      if (!err) {
        roles = results.map(function(roleMapping) {
          return roleMapping.role().name;
        });
      }
      cb(err, roles);
    });
    return cb.promise;
  };

  User.remoteMethod(
    'getRolesById',
    {
      description: 'Get roles for a user',
      http: {path: '/roles', verb: 'get'},
      returns: {arg: 'roles', type: 'object'},
      isStatic: false
    }
  );

  // add put role method to User
  User.prototype.addRolesById = function (roleNames, cb) {
    cb = cb || utils.createPromiseCallback();
    if (!_.isArray(roleNames)) {
      roleNames = [roleNames];
    }
    var RoleMapping = User.app.models.RoleMapping,
        Role = User.app.models.Role,
        user = this;

    var findPromises = [];
    roleNames.forEach(function (roleName) {
      findPromises.push(new Promise(function (resolve, reject) {
        Role.findOne({
          where: {name: roleName}
        }, function (err, result) {
          if (!err && result) {
            resolve(result);
          } else {
            var err1 = new Error('Unknown "role" name "' + roleName + '".');
            err1.statusCode = 404;
            err1.code = 'MODEL_NOT_FOUND';
            reject(err || err1);
          }
        });
      }));
    });
    Promise.all(findPromises)
      .then(function (results) {
        var createPromises = [];
        results.forEach(function (role) {
          var principal = {
            roleId: role.id,
            principalType: RoleMapping.USER,
            principalId: user.id
          };
          createPromises.push(
            new Promise(function (resolve, reject) {
              RoleMapping.findOrCreate(
                {where: principal},
                principal,
                function (err, result) {
                  if (err) reject(err); else resolve(result);
                }
              );
            })
          );
        });
        return Promise.all(createPromises);
      })
      .then(function (results) {
        cb(null, results);
      }, function (err) {
        cb(err);
      });
    return cb.promise;
  };

  User.remoteMethod(
    'addRolesById',
    {
      description: 'Add role to a user',
      accepts: [
        {arg: 'roleName', type: 'object', http: {source: 'body'}}
      ],
      http: {path: '/roles', verb: 'post'},
      returns: {root: true, type: 'object'},
      isStatic: false
    }
  );

  // add delete role method to User
  User.prototype.deleteRoleById = function (roleName, cb) {
    cb = cb || utils.createPromiseCallback();
    var RoleMapping = User.app.models.RoleMapping,
        Role = User.app.models.Role,
        user = this;
    Role.findOne({
      where: {
        name: roleName
      }
    }, function (err, role) {
      if (!err && role) {
        var principal = {
          roleId: role.id,
          principalType: RoleMapping.USER,
          principalId: user.id
        };
        RoleMapping.destroyAll(principal, cb);
      } else {
        var err1 = new Error('Unknown "role" name "' + roleName + '".');
        err1.statusCode = 404;
        err1.code = 'MODEL_NOT_FOUND';
        cb(err || err1);
      }
    });
    return cb.promise;
  };

  User.remoteMethod(
    'deleteRoleById',
    {
      description: 'Delete role of a user',
      accepts: [
        {arg: 'roleName', type: 'string', required: true}
      ],
      http: {path: '/roles/:roleName', verb: 'delete'},
      returns: {root: true, type: 'object'},
      isStatic: false
    }
  );

};
