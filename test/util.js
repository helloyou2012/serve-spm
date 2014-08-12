var join = require('path').join;
var touch = require('touch');
var util = require('../util');

describe('util', function() {

  it('template', function() {
    util.template('').should.be.equal('');
    util.template('{{a}}', {a:'b'}).should.be.equal('b');
    util.template('{{b}}', {a:'b'}).should.be.equal('');
  });

  it('isRelative', function() {
    util.isRelative('./a').should.be.equal(true);
  })

  it('define', function() {
    util.define('alert(1);').should.be.equal(
      'define(function(require, exports, module){\n' +
      'alert(1);' +
      '\n});\n'
      );
  });

  it('getPkg', function() {
    var root = join(__dirname, 'fixtures/getpkg');

    var p1 = util.getPkg(root);
    p1.name.should.be.equal('a');
    p1.version.should.be.equal('0.1.0');

    var p2 = util.getPkg(root);
    p2.should.be.equal(p1);

    touch.sync(join(root, 'package.json'));
    var p3 = util.getPkg(root);
    p3.should.not.be.equal(p1);
    p3.name.should.be.equal('a');
    p3.version.should.be.equal('0.1.0');
  });
});
