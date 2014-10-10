var path = require('path');
var util = require('../util');
var requires = require('searequire');
var format = require('util').format;
var through = require('through2');
var rename = require('rename');

module.exports = function jsParser(options) {
  return through.obj(function(file) {
    file = parser(file, options);
    this.push(file);
  });
};

function parser(file, options) {
  file.contents = new Buffer(transportFile(file, options));

  var pkg = options.pkg;
  var id;
  if (options.isEntry) {
    id = util.template('{{name}}/{{version}}/{{filepath}}', {
      name: pkg.name,
      version: pkg.version,
      filepath: path.relative(options.root, file.path)
    });
  }
  if (!options.req || id !== options.req.pathname.slice(1)) {
    id = '';
  }

  file.contents = new Buffer(util.define(file.contents, id));
  return file;
}

function transportFile(file, options) {
  return requires(file.contents.toString(), function(item) {
    var dep = item.path.toLowerCase();

    if (util.isRelative(dep)) {
      if (util.isCSSFile(dep)) {
        return format('require("%s")', rename(dep, {extname:'.css'}));
      }
      return item.string;

    } else {
      var arr = dep.split('/');
      dep = arr.shift();

      var p = options.pkg.dependencies[dep];
      if (!p) return item.string;

      var main = p.main;
      // is require pkg file
      if (arr.length > 0) {
        main = arr.join('/');
      }
      return format('require("%s/%s/%s")',
        p.name, p.version, main);
    }
  });
}
