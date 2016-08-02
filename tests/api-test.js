'use strict';

/* jshint camelcase: false */
var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

function json(verb, url, auth) {
  var promise = request(app)[verb](url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (auth && typeof auth === 'string') {
    promise = promise
      .set('Authorization', auth);
  }

  return promise
    .expect('Content-Type', /json/);
}

var user = {username: 'tidyzq', password: '123456', email: 'tidyzq@tidyzq.com'},
    userInfo = {id: 0, accessToken: '', todos: []};

describe('REST API request', function() {
  before(function(done) {
    require('./start-server');
    done();
  });

  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('create sample users', function(done) {
    json('post', '/api/users')
      .send(user)
      .expect(200, function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id, 'must have an id');
        userInfo.id = res.body.id;
        done();
      });
  });

  it('should login successfully', function(done) {
    json('post', '/api/users/login')
      .send(user)
      .expect(200, function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id, 'must have an access token');
        assert.equal(res.body.userId, userInfo.id);
        userInfo.accessToken = res.body.id;
        done();
      });
  });

  it('should post todo with login', function(done) {
    json('post', '/api/todos', userInfo.accessToken)
      .send({
        content: 'test',
        ownerId: 10
      })
      .expect(200, function(err, res) {
        assert.ifError(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.content, 'test');
        assert.equal(res.body.ownerId, userInfo.id);
        userInfo.todos.push(res.body);
        done();
      });
  });

  it('should query all todos without login', function(done) {
    json('get', '/api/todos')
      .expect(200, function(err, res) {
        assert.ifError(err);
        assert(typeof res.body === 'object');
        assert.deepEqual(res.body, userInfo.todos);
        done();
      });
  });

  it('should not post todo without login', function(done) {
    json('post', '/api/todos')
      .send({
        content: 'test',
        ownerId: userInfo.id
      })
      .expect(401, done);
  });

  it('should not update todo without login', function(done) {
    json('put', '/api/todos/' + userInfo.todos[0].id)
      .send({
        content: 'test again'
      })
      .expect(401, done);
  });

  it('should not delete todo without login', function(done) {
    json('delete', '/api/todos/' + userInfo.todos[0].id)
      .expect(401, done);
  });

  it('should update todo with login', function(done) {
    var now = (new Date()).toISOString();
    json('put', '/api/todos/' + userInfo.todos[0].id, userInfo.accessToken)
      .send({
        content: 'test again',
        ownerId: 10,
        createdDate: now,
        modifiedDate: now
      })
      .expect(200, function(err, res) {
        assert.ifError(err);
        assert(typeof res.body === 'object');
        assert.equal(res.body.content, 'test again');
        assert.equal(res.body.id, userInfo.todos[0].id);
        assert.notEqual(res.body.createdDate, now);
        assert.notEqual(res.body.modifiedDate, now);
        userInfo.todos[0] = res.body;
        done();
      });
  });

  it('should query all todos with login', function(done) {
    json('get', '/api/todos', userInfo.accessToken)
      .expect(200, function(err, res) {
        assert.ifError(err);
        assert(typeof res.body === 'object');
        assert.deepEqual(res.body, userInfo.todos);
        done();
      });
  });

  it('should delete todo with login', function(done) {
    json('delete', '/api/todos/' + userInfo.todos[0].id, userInfo.accessToken)
      .expect(200, function(err, res) {
        assert.ifError(err);
        json('get', '/api/todos')
          .expect(200, function(err, res) {
            assert.ifError(err);
            assert(res.body.length === 0);
            userInfo.todos.pop();
            done();
          });
      });
  });

});
