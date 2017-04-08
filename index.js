'use strict';
let fs = require('fs');
let path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var template = _.template;

var __include;

function compile(options, data, render) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
      return;
    }

    try {
      var tpl = template(file.contents.toString(), options);
      data[__include] = function(p, opts) {
        opts = opts || data;
        return template(fs.readFileSync(path.join(options.dirname || __dirname, p), 'utf8'))(opts);
      };
      file.contents = new Buffer(render ? tpl(_.merge({}, file.data, data)) : tpl.toString());
      delete(data[__include]);
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
    }

    cb();
  });
}

module.exports = function (data, options) {
  __include = options.__include || '__include';
  return compile(options, data, true);
};

module.exports.precompile = function (options) {
  return compile(options);
};
