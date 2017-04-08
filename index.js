'use strict';
let fs = require('fs');
let path = require('path');
let gutil = require('gulp-util');
let through = require('through2');
let _ = require('lodash');
let template = _.template;

let __include;

function compile(options, data, render) {
  function include(p, opts) {
    opts = opts || data;
    return template(fs.readFileSync(path.join(options.dirname || __dirname, p), 'utf8'))(opts);
  }
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
      let tpl = template(file.contents.toString(), options);
      data[__include] = include;
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
