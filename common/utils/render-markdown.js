var marked = require('marked');
var katex = require('katex');

marked.setOptions({
  math: function(text) {
    try {
      return katex.renderToString(text, { displayMode: true });
    } catch (error) {
      return error.message;
    }
  },
  inlineMath: function(text) {
    try {
      return katex.renderToString(text, { displayMode: false });
    } catch (error) {
      return error.message;
    }
  }
});

module.exports = marked;
