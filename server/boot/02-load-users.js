'use strict';

var log = require('debug')('boot:02-load-users');

module.exports = function(app, done) {
  var User = app.models.user,
      Role = app.models.Role,
      RoleMapping = app.models.RoleMapping;

  function createDefaultRoleAndUsers() {
    return new Promise(function(resolve, reject) {
      log('creating default users');

      var roles = {
        admin: [{
          realm: 'admin',
          username: 'admin',
          email: 'admin@admin.com',
          password: 'admin'
        }]
      };

      var promises = [];

      for (var roleName in roles) {
        var users = roles[roleName];
        promises.push(createRole(roleName, users));
      }

      Promise.all(promises)
        .then(resolve, reject);

    });
  }

  function createRole(roleName, users) {
    return new Promise(function(resolve, reject) {
      Role.findOrCreate(
        { where: { name: roleName } }, // find
        { name: roleName }, // create
        function(err, createdRole, created) {
          if (err) {
            reject('Error on createRole: ' + err);
          } else {
            created ? log('creating role: ' + roleName)
                    : log('found role: ' + roleName);

            var promises = [];
            users.forEach(function(user) {
              promises.push(createUser(user, createdRole));
            });

            Promise.all(promises)
              .then(resolve, reject);
          }
      });
    });
  }

  function createUser(user, role) {
    return new Promise(function(resolve, reject) {
      User.findOrCreate(
        { where: { username: user.username }}, // find
        user, // create
        function(err, createdUser, created) {
          if (err) {
            reject('Error on createUser: ' + err);
          } else {
            created ? log('creating user: ' + user.username)
                    : log('found user: ' + user.username);

            createPrincipal(role, createdUser)
              .then(resolve, reject);
          }
      });
    });
  }

  function createPrincipal(role, user) {
    return new Promise(function(resolve, reject) {

      var principal = {
        roleId: role.id,
        principalType: RoleMapping.USER,
        principalId: user.id
      };

      RoleMapping.findOrCreate(
        { where: principal }, // find
        principal, // create
        function(err, rolePrincipal, created) {
        if (err) {
          reject('Error on createPrincipal: ' + err);
        } else {
          created ? log('creating principal: ' + user.username + ' => ' + role.name)
                  : log('found principal: ' + user.username + ' => ' + role.name);
          resolve();
        }
      });
    });
  }

  createDefaultRoleAndUsers().then(function () {
    log('done');
    done();
  }, console.error);

};
