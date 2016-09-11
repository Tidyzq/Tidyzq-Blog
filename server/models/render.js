var jade = require('pug');
var utils = require('loopback/lib/utils');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var $ = require('cheerio');

function createDir(dir) {
  return new Promise(function (resolve, reject) {
    if (dir !== '.') {
      createDir(path.dirname(dir))
        .then(function () {
          fs.readdir(dir, function (err) {
            if (err) {
              fs.mkdir(dir, function (err) {
                if (err) reject(err);
                else resolve(dir);
              });
            } else {
              resolve(dir);
            }
          });
        });
    } else {
      resolve(dir);
    }
  });
}

function createFile(file, data, options) {
  var dirname = path.dirname(file);
  return new Promise(function (resolve, reject) {
    createDir(dirname)
      .then(function () {
        fs.writeFile(file, data, options, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
  });
}

function shortenHtml(str) {
  var cut = 100;
  var text = $(str).text();
  if (text.length > cut) {
    text = text.substr(0, cut) + '...';
  }
  return text;
}

function getPagination (base) {
  return function (a, index, array) {
    return {
      base: base,
      index: index + 1,
      totle: array.length,
      first: index === 0,
      last: index === array.length - 1
    };
  };
}

var dev = !!process.env.DEV;

var indexTemplate = 'client/src/blog/render-template/index.pug';
var postTemplate = 'client/src/blog/render-template/post.pug';
var pageTemplate = 'client/src/blog/render-template/page.pug';
var tagTemplate = 'client/src/blog/render-template/tag.pug';
var authorTemplate = 'client/src/blog/render-template/author.pug';

var indexRender = jade.compileFile(indexTemplate);
var postRender = jade.compileFile(postTemplate);
var pageRender = jade.compileFile(pageTemplate);
var tagRender = jade.compileFile(tagTemplate);
var authorRender = jade.compileFile(authorTemplate);

var distPath = 'client/dist';

if (dev) {
  indexRender = function(locals) {
    return jade.compileFile(indexTemplate)(locals);
  };
  postRender = function(locals) {
    return jade.compileFile(postTemplate)(locals);
  };
  pageRender = function(locals) {
    return jade.compileFile(pageTemplate)(locals);
  };
  tagRender = function(locals) {
    return jade.compileFile(tagTemplate)(locals);
  };
  authorRender = function(locals) {
    return jade.compileFile(authorTemplate)(locals);
  };
  distPath = 'client/.tmp';
}

var renderLocals = {
  shortenHtml: shortenHtml
};

module.exports = function(Render) {

  var getSettings = function (data) {
    var Setting = Render.app.models.setting;
    return Setting
      .find()
      .then(function (settings) {
        var result = {};
        settings.forEach(function (setting) {
          result[setting.key] = setting.value;
        });
        return _.extend(data, {
          settings: result
        });
      });
  };

  var getPosts = function (data) {
    var Post = Render.app.models.post;
    return Post
      .remoteFind({
        include: [
          'author',
          'tags'
        ]
      })
      .then(function (posts) {
        return _.extend(data, {
          posts: posts
        });
      });
  };

  var getPages = function (data) {
    var Page = Render.app.models.page;
    return Page
      .remoteFind()
      .then(function (pages) {
        return _.extend(data, {
          pages: pages
        });
      });
  }

  var getTags = function (data) {
    var Tag = Render.app.models.tag;
    return Tag
      .find()
      .then(function (tags) {
        var promises = tags.map(function (tag) {
          return Tag['__get__posts']
            (
              tag.url,
              {
                include: ['tags', 'author']
              }
            )
            .then(function (posts) {
              var result = _.extend({
                posts: posts
              }, tag);
              return result;
            });
        });
        return Promise.all(promises);
      })
      .then(function (tags) {
        return _.extend(data, {
          tags: tags
        });
      });
  };

  var getAuthors = function (data) {
    var User = Render.app.models.user,
        Post = Render.app.models.post;
    return User
      .find()
      .then(function (users) {
        var promises = users.map(function (user) {
          return Post
            .find({
              where: {
                authorId: user.id
              },
              include: ['tags', 'author']
            })
            .then(function (posts) {
              return _.extend({
                posts: posts,
                totlePosts: posts.length
              }, user);
            });
        });
        return Promise.all(promises);
      })
      .then(function (users) {
        return _.extend(data, {
          authors: users
        });
      });
    };

  Render.indexRender = function (callback) {
    callback = callback || utils.createPromiseCallback();

    return getSettings({})
      .then(getPosts)
      // split page and calculate pagination
      .then(function (data) {
        data.posts = _.chunk(data.posts, data.settings.postsPerPage);
        data.paginations = data.posts.map(getPagination(''));
        data.bodyClasses = data.posts.map(function (posts, index, array) {
          return index === 0 ? 'home-template' : 'paged archive-template';
        });
        data.pageNumber = data.posts.length;
        return data;
      })
      // render pages and save to file
      .then(function (data) {
        var renderPromises = [];
        for (var i = 0; i < data.pageNumber; ++i) {
          var locals = _.extend({
            setting: data.settings,
            posts: data.posts[i],
            pagination: data.paginations[i],
            bodyClass: data.bodyClasses[i]
          }, renderLocals);
          var html = indexRender(locals);
          var filePath = (i === 0) ? 'index.html'
                                   : ('page/' + (i + 1) + '/index.html');
          renderPromises.push(createFile(path.join(distPath, filePath), html));
        }
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'indexRender',
    {
      description: 'Render index pages',
      http: {path: '/index-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

  Render.postRender = function (callback) {
    callback = callback || utils.createPromiseCallback();
    return getSettings({})
      .then(getPosts)
      .then(function (data) {
        var renderPromises = data.posts.map(function (post) {
          var locals = _.extend({
            setting: data.settings,
            post: post
          }, renderLocals);
          var html = postRender(locals);
          var filePath = post.url + '/index.html';
          return createFile(path.join(distPath, filePath), html);
        });
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'postRender',
    {
      description: 'Render post pages',
      http: {path: '/post-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

  Render.pageRender = function (callback) {
    callback = callback || utils.createPromiseCallback();

    return getSettings({})
      .then(getPages)
      .then(function (data) {
        var renderPromises = data.pages.map(function (page) {
          var locals = _.extend({
            setting: data.settings,
            page: page
          }, renderLocals);
          var html = pageRender(locals);
          var filePath = page.url + '/index.html';
          return createFile(path.join(distPath, filePath), html);
        });
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'pageRender',
    {
      description: 'Render page pages',
      http: {path: '/page-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

  Render.tagRender = function (callback) {
    callback = callback || utils.createPromiseCallback();
    return getSettings({})
      .then(getTags)
      .then(function (data) {
        data.tags = data.tags.map(function (tag) {
          tag.posts = _.chunk(tag.posts, data.settings.postsPerPage);
          tag.paginations = tag.posts.map(getPagination('tag/' + tag.url));
          tag.pageNumber = tag.posts.length;
          return tag;
        });
        return data;
      })
      .then(function (data) {
        var renderPromises = _.flatMap(data.tags, function (tag) {
          return tag.posts.map(function (posts, index) {
            var locals = _.extend({
              setting: data.settings,
              tag: tag,
              posts: posts,
              pagination: tag.paginations[index]
            }, renderLocals);
            var html = tagRender(locals);
            var filePath = 'tag/' + tag.url + '/';
            filePath += (index === 0) ? 'index.html'
                                      : ('page/' + (index + 1) + '/index.html');
            return createFile(path.join(distPath, filePath), html);
          });
        });
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'tagRender',
    {
      description: 'Render tag pages',
      http: {path: '/tag-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );

  Render.authorRender = function (callback) {
    callback = callback || utils.createPromiseCallback();
    return getSettings({})
      .then(getAuthors)
      .then(function (data) {
        data.authors = data.authors.map(function (author) {
          author.posts = _.chunk(author.posts, data.settings.postsPerPage);
          author.paginations = author.posts.map(getPagination('author/' + author.username));
          author.pageNumber = author.posts.length;
          return author;
        });
        return data;
      })
      .then(function (data) {
        var renderPromises = _.flatMap(data.authors, function (author) {
          return author.posts.map(function (posts, index) {
            var locals = _.extend({
              setting: data.settings,
              author: author,
              posts: posts,
              pagination: author.paginations[index]
            }, renderLocals);
            var html = authorRender(locals);
            var filePath = 'author/' + author.username + '/';
            filePath += (index === 0) ? 'index.html'
                                      : ('page/' + (index + 1) + '/index.html');
            return createFile(path.join(distPath, filePath), html);
          });
        });
        return Promise.all(renderPromises);
      })
      .then(function (results) {
        callback(null, 'success');
        return results;
      })
      .catch(function (err) {
        callback(err);
        throw err;
      });
  };

  Render.remoteMethod(
    'authorRender',
    {
      description: 'Render author pages',
      http: {path: '/author-render', verb: 'post'},
      returns: {arg: 'result', type: 'object'}
    }
  );
};
