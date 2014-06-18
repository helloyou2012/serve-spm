var util = require('../util');
var imports = require('css-imports');
var format = require('util').format;
var through = require('through2');

module.exports = function cssParser(options) {
  return through.obj(function(file) {
    file = parser(file, options);
    this.push(file);
  });
};

function parser(file, options) {
  file.contents = new Buffer(transportFile(file, options.pkg));
  return file;
}

function transportFile(file, pkg) {
  return imports(file.contents, function(item) {
    var dep = item.path;

    if (util.isRelative(dep)) {
      return item.string;
    }

    else {
      var p = pkg.dependencies[dep];
      return format('@import "/sea-modules/%s/%s/%s";',
        p.name, p.version, p.main);
    }
  });
}