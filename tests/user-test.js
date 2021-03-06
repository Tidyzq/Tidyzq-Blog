'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = function(json, data) {
  describe('测试user', function () {

    it('未登陆无法创建用户', function(done) {
      json('post', '/api/users')
        .send(data.user)
        .expect(401, done);
    });

    it('登陆管理员用户', function(done) {
      json('post', '/api/users/login')
        .send(data.admin)
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(typeof res.body === 'object');
          assert(res.body.id, 'must have an access token');
          // 获取accessToken和id
          data.adminInfo.id = res.body.userId;
          data.adminInfo.accessToken = res.body.id;
          done();
        });
    });

    it('管理员能够获取用户列表', function(done) {
      json('get', '/api/users', data.adminInfo.accessToken)
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body));
          assert(!_.isEmpty(res.body));
          done();
        });
    });

    it('普通用户不能够获取用户列表', function(done) {
      json('get', '/api/users', data.userInfo.accessToken)
        .expect(401, done);
    });

    it('创建测试普通用户', function(done) {
      json('post', '/api/users', data.adminInfo.accessToken)
        .send(data.user)
        .expect(200, function(err, res) {
          assert(typeof res.body === 'object');
          assert(res.body.id, 'must have an id');
          // 获取用户id
          data.userInfo.id = res.body.id;
          done();
        });
    });

    it('登陆普通用户', function(done) {
      json('post', '/api/users/login')
        .send(data.user)
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(typeof res.body === 'object');
          assert(res.body.id, 'must have an access token');
          // 返回userId与用户id相同
          assert.equal(res.body.userId, data.userInfo.id);
          // 获取accessToken
          data.userInfo.accessToken = res.body.id;
          done();
        });
    });

    it('获取普通用户身份', function(done) {
      json('get', '/api/users/' + data.userInfo.id + '/roles', data.userInfo.accessToken)
        .expect(200, function(err, res) {
          // console.log(res);
          assert.ifError(err);
          assert(_.isArray(res.body.roles));
          assert(_.isEmpty(res.body.roles));
          done();
        });
    });

    it('获取管理员身份', function(done) {
      json('get', '/api/users/' + data.adminInfo.id + '/roles', data.adminInfo.accessToken)
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body.roles));
          assert(_.includes(res.body.roles, 'admin'));
          done();
        });
    });

    it('普通用户不能获取其他用户身份', function(done) {
      json('get', '/api/users/' + data.adminInfo.id + '/roles', data.userInfo.accessToken)
        .expect(401, done);
    });

    it('管理员可以获取其他用户身份', function(done) {
      json('get', '/api/users/' + data.userInfo.id + '/roles', data.adminInfo.accessToken)
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body.roles));
          assert(_.isEmpty(res.body.roles));
          done();
        });
    });

    it('普通用户不能添加身份', function(done) {
      json('post', '/api/users/' + data.userInfo.id + '/roles', data.userInfo.accessToken)
        .send(['admin'])
        .expect(401, done);
    });

    it('管理员可以添加身份', function(done) {
      json('post', '/api/users/' + data.userInfo.id + '/roles', data.adminInfo.accessToken)
        .send(['admin'])
        .expect(200, function(err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body.roleMappings));
          assert(_.every(res.body.roleMappings, function(r) { return r.principalId === data.userInfo.id; }));
          // 查看是否有admin身份
          json('get', '/api/users/' + data.userInfo.id + '/roles', data.userInfo.accessToken)
            .expect(200, function(err, res) {
              assert.ifError(err);
              assert(_.isArray(res.body.roles));
              assert(_.includes(res.body.roles, 'admin'));
              done();
            });
        });
    });

    it('无法添加错误身份', function(done) {
      json('post', '/api/users/' + data.userInfo.id + '/roles', data.userInfo.accessToken)
        .send(['wrong', 'roleee'])
        .expect(404, done);
    });

    it('删除身份', function(done) {
      json('delete', '/api/users/' + data.userInfo.id + '/roles/admin', data.adminInfo.accessToken)
        .expect(200, function(err, res) {
          assert.ifError(err);
          // 查看是否有admin身份
          json('get', '/api/users/' + data.userInfo.id + '/roles', data.userInfo.accessToken)
            .expect(200, function(err, res) {
              assert.ifError(err);
              assert(_.isArray(res.body.roles));
              assert(_.isEmpty(res.body.roles));
              done();
            });
        });
    });

  });
};
