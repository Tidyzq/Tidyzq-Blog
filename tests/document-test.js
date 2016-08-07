'use strict';

var assert = require('assert');
var _ = require('lodash');
var faker = require('faker');

var getDocument = function() {
  return {
    title: faker.name.title(),
    markdown: faker.fake('> {{lorem.sentence}}'),
    status: faker.random.arrayElement([
      'published',
      'draft'
    ]),
    isPage: faker.random.boolean()
  };
};

module.exports = function(json, data) {
  describe('测试document', function() {

    it('未登陆无法创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      json('post', '/api/documents')
        .send(doc)
        .expect(401, done);
    });

    it('普通用户创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      doc.status = 'draft';
      json('post', '/api/documents', data.userInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          // 将创建的文章放入userInfo
          data.userInfo.documents.push(res.body);
          done();
        });
    });

    it('通过users接口创建', function(done) {
      var doc = getDocument();
      doc.authorId = data.userInfo.id;
      doc.status = 'draft';
      json('post', '/api/users/' + data.userInfo.id + '/documents', data.userInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          // 将创建的文章放入userInfo
          data.userInfo.documents.push(res.body);
          done();
        });
    });

    it('管理员创建文章', function(done) {
      var doc = getDocument();
      doc.authorId = data.adminInfo.id;
      doc.status = 'draft';
      json('post', '/api/documents', data.adminInfo.accessToken)
        .send(doc)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isMatch(res.body, doc));
          // 将创建的文章放入adminInfo
          data.adminInfo.documents.push(res.body);
          done();
        });
    });

    it('未登陆无法获取文章列表', function(done) {
      json('get', '/api/documents')
        .expect(401, done);
    });

    it('普通用户可以获取文章列表', function(done) {
      json('get', '/api/documents', data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body));
          // res.body 中是否包含 userInfo.documents
          assert(_.every(data.userInfo.document, function (doc) { return _.includes(res.body, doc); }));
          // res.body 中是否包含 adminInfo.documents
          assert(_.every(data.adminInfo.document, function (doc) { return _.includes(res.body, doc); }));
          done();
        });
    });

    it('通过users接口获取', function(done) {
      json('get', '/api/users/' + data.userInfo.id + '/documents', data.userInfo.accessToken)
        .expect(200, function (err, res) {
          assert.ifError(err);
          assert(_.isArray(res.body));
          assert.deepEqual(res.body, data.userInfo.documents);
          done();
        });
    });

  });
};
