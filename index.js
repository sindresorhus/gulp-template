'use strict';
const PluginError = require('plugin-error');
const through = require('through2');
const _ = require('lodash');
const Buffer = require('safe-buffer').Buffer;

const template = _.template;

function compile(options, data, render) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		try {
			const tpl = template(file.contents.toString(), options);
			file.contents = Buffer.from(render ? tpl(_.merge({}, file.data, data)) : tpl.toString());
			this.push(file);
		} catch (err) {
			this.emit('error', new PluginError('gulp-template', err, {fileName: file.path}));
		}

		cb();
	});
}

module.exports = (data, options) => compile(options, data, true);
module.exports.precompile = options => compile(options);
