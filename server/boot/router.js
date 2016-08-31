var loopback = require('loopback');
var path = require('path');
var fs = require('fs');

module.exports = function(app) {
  var router = app.loopback.Router();

  var dev = !!process.env.DEV,
      dir = '';

  if (dev) {
    dir = '.tmp';
  } else {
    dir = 'dist';
  }

  router.use('/vendor', loopback.static('client/vendor'));
  router.use('/api', app.loopback.rest());
  router.get('/status', app.loopback.status());

  router.use('/console', loopback.static(path.join('client/console', dir)));
  router.get(/\/console\/(.+)/, function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    var file = req.params[0]
    fs.access(path.join(__dirname, '../../client/console', dir, file), fs.F_OK, function (err) {
      if (err) {
        res.sendFile(path.join(__dirname, '../../client/console', dir, 'index.html'));
      } else {
        res.sendFile(path.join(__dirname, '../../client/console', dir, file));
      }
    })
  });

  router.use(loopback.static(path.join('client/blog', dir)));

  app.use(router);
};
