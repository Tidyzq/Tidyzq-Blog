'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = function(json, data) {
  describe('测试setting', function () {

    it('任何人可以获取设置', function(done) {
      json('get', '/api/settings')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 3, 'should equal to 3');
          assert(_.every(res.body, function(item) {
            return _.every(['key', 'value'], _.partial(_.has, item));
          }), 'should have key and value');
          data.settings = res.body;
          done();
        });
    });

    it('任何人可以通过key获取设置', function(done) {
      json('get', '/api/settings/' + data.settings[0].key)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.deepEqual(res.body, data.settings[0], 'should equal to setting');
          done();
        });
    });

    it('任何人可以通过key获取设置(错误示例)', function(done) {
      json('get', '/api/settings/' + 'data.settings[0].key')
        .expect(404, done);
    });

    it('任何人可以查看设置数量', function(done) {
      json('get', '/api/settings/count')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(res.body.count, 'res.body should exists');
          assert.equal(res.body.count, data.settings.length, 'should equal to length');
          done();
        });
    });

    it('任何人可以查看设置是否存在', function(done) {
      json('get', '/api/settings/' + data.settings[0].key + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, true, 'should exists');
          done();
        });
    });

    it('任何人可以查看设置是否存在(错误示例)', function(done) {
      json('get', '/api/settings/' + 'data.settings[0].key' + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, false, 'should not exists');
          done();
        });
    });

    it('访客不能更改设置', function(done) {
      json('put', '/api/settings/' + data.settings[0].key)
        .send({
          'value': 'test'
        })
        .expect(401, done);
    });

    it('普通用户不能更改设置', function(done) {
      json('put', '/api/settings/' + data.settings[0].key, data.userInfo.accessToken)
        .send({
          'value': 'test'
        })
        .expect(401, done);
    });

    it('管理员可以更改设置', function(done) {
      var setting = _.cloneDeep(data.settings[0]);
      setting.value = 'test';
      json('put', '/api/settings/' + data.settings[0].key, data.adminInfo.accessToken)
        .send(setting)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isMatch(res.body, setting), 'should match');
          json('get', '/api/settings/' + data.settings[0].key)
            .expect(200, function (err, res) {
              assert.ifError(err);
              assert(res.body, 'res.body should exists');
              assert(_.isMatch(res.body, setting), 'should match');
              data.settings[0] = res.body;
              done();
            });
        });
    });

    it('访客不能删除设置', function(done) {
      json('delete', '/api/settings/' + data.settings[0].key)
        .expect(401, done);
    });

    it('普通用户不能删除设置', function(done) {
      json('delete', '/api/settings/' + data.settings[0].key, data.userInfo.accessToken)
        .expect(401, done);
    });

    it('管理员可以删除设置', function(done) {
      json('delete', '/api/settings/' + data.settings[0].key, data.adminInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.count, 1, 'should equal to 1');
          json('get', '/api/settings/' + data.settings[0].key)
            .expect(404, function (err, res) {
              assert.ifError(err);
              done();
            });
        });
    });

    it('将删除的设置重新放回', function(done) {
      var setting = _.cloneDeep(data.settings[0]);
      json('put', '/api/settings/', data.adminInfo.accessToken)
        .send(setting)
        .expect(200, done);
    });

  });
};
