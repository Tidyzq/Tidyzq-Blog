var utils = require('loopback/lib/utils');
var extendInclude = require('../utils/extend-include');
var overrideRemoteMethod = require('../utils/override-remote-method');
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

  // override build-in findById
  User.remoteFindById = function (id, filter, callback) {
    if (_.isFunction(filter)) {
      callback = filter;
      filter = {};
    }
    callback = callback || utils.createPromiseCallback();
    filter = filter || {};
    filter.include = extendInclude(filter.include);
    if (_.some(filter.include, {relation: 'roles'})) {
      _.remove(filter.include, {relation: 'roles'});
      User.origFindById(id, filter, function (err, result) {
        if (!err) {
          var user = result;
          user.getRolesById(function (err, result) {
            if (!err) {
              user.roles = result;
              callback(null, user);
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      User.origFindById(id, filter, callback);
    }
    return callback.promise;
  };

  // override build-in find
  User.remoteFind = function (filter, callback, c) {
    if (!_.isFunction(callback)) {
      callback = c;
    }
    callback = callback || utils.createPromiseCallback();
    filter = filter || {};
    filter.include = extendInclude(filter.include);
    if (_.some(filter.include, {relation: 'roles'})) {
      _.remove(filter.include, {relation: 'roles'});
      User.origFind(filter, function (err, results) {
        if (!err) {
          var users = results;
          var callbacks = [];
          users.forEach(function (user, index) {
            callbacks[index] = function () {
              user.getRolesById(function (err, result) {
                if (!err) {
                  users[index].roles = result;
                  callbacks[index + 1]();
                } else {
                  callback(err);
                }
              });
            };
          });
          callbacks[users.length] = function () {
            callback(null, users);
          };
          callbacks[0]();
        } else {
          callback(err);
        }
      });
    } else {
      return User.origFind(filter, callback);
    }
    return callback.promise;
  };

  // override build in methods
  User.on('attached',function () {

    overrideRemoteMethod(User, 'findById', User.remoteFindById);
    overrideRemoteMethod(User, 'find', User.remoteFind);

  });

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
    console.log(roleNames);
    if (_.isObject(roleNames) && !_.isArray(roleNames)) {
      roleNames = roleNames.roleNames;
    }
    if (!_.isArray(roleNames)) {
      roleNames = [roleNames];
    }
    console.log(roleNames);
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
        {arg: 'roleNames', type: 'object', http: {source: 'body'}}
      ],
      http: {path: '/roles', verb: 'post'},
      returns: {arg: 'roleMappings', type: 'object'},
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
