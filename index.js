'use strict';
var es = require('event-stream');
var gutil = require('gulp-util');
var tpl = require('lodash.template');
var argv = require('optimist').argv;

// The plugin name as a constant.
var PLUGIN_NAME = 'gulp-template';

function GulpTemplate(data, options, fromCli) {
	return es.map(function (file, cb) {
		file.contents = new Buffer(tpl(file.contents.toString(), data, options));
		cb(null, file);
	});
};
module.exports = GulpTemplate;
