'use strict';

var assert = require('assert');
var _ = require('lodash');

module.exports = function(json, data) {
  describe('测试post', function () {

    it('获取post', function(done) {
      json('get', '/api/posts')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 1, 'should equal to 1');
          assert.deepEqual(res.body[0], data.userInfo.documents[1], 'should be equal to post');
          done();
        });
    });

    it('通过url获取post', function(done) {
      json('get', '/api/posts/' + data.userInfo.documents[1].url)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.deepEqual(res.body, data.userInfo.documents[1], 'should be equal to post');
          done();
        });
    });

    it('通过url获取post(错误示例)', function(done) {
      json('get', '/api/posts/' + 'data.userInfo.documents[1].url')
        .expect(404, done);
    });

    it('判断post是否存在', function(done) {
      json('get', '/api/posts/' + data.userInfo.documents[1].url + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, true, 'should be equal to true');
          done();
        });
    });

    it('判断post是否存在(错误示例)', function(done) {
      json('get', '/api/posts/' + 'data.userInfo.documents[1].url' + '/exists')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.exists, false, 'should be equal to false');
          done();
        });
    });

    it('获取posts数量', function(done) {
      json('get', '/api/posts/count')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.count, 1, 'should be equal to 1');
          done();
        });
    });

    it('获取post的标签', function(done) {
      json('get', '/api/posts/' + data.userInfo.documents[1].url + '/tags')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert(_.isArray(res.body), 'should be array');
          assert.equal(res.body.length, 1, 'should equal to 1');
          assert.deepEqual(res.body[0], data.tags[0], 'should be equal to tag');
          done();
        });
    });

    it('获取post的标签(错误示例)', function(done) {
      json('get', '/api/posts/' + 'data.userInfo.documents[1].url' + '/tags')
        .expect(404, done);
    });

    it('获取post的标签数量', function(done) {
      json('get', '/api/posts/' + data.userInfo.documents[1].url + '/tags/count')
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(res.body, 'res.body should exists');
          assert.equal(res.body.count, 1, 'should equal to 1');
          done();
        });
    });

    it('获取post的标签数量(错误示例)', function(done) {
      json('get', '/api/posts/' + 'data.userInfo.documents[1].url' + '/tags/count')
        .expect(404, done);
    });

    it('判断post的标签是否存在', function(done) {
      json('head', '/api/posts/' + data.userInfo.documents[1].url + '/tags/rel/' + data.tags[0].id)
        .expect(200, done);
    });

  });
};
