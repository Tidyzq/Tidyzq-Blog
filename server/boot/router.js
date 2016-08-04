var loopback = require('loopback');
var path = require('path');

module.exports = function(app) {
  var router = app.loopback.Router();
  router.use(loopback.static('client/.tmp'));
  router.use('/vendor', loopback.static('client/vendor'));
  router.use('/api', app.loopback.rest());
  router.get('/status', app.loopback.status());
  router.get('*', function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(path.join(__dirname, '../../client/.tmp/index.html'));
  });
  app.use(router);
};
