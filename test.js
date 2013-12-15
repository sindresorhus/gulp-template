'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var template = require('./index');

it('should compile Lodash templates', function (cb) {
	var stream = template({greeting: 'Hello'});

	stream.on('data', function (data) {
		assert.equal(String(data.contents), 'Hello World');
		cb();
	});

	stream.write(new gutil.File({contents: '<%= greeting %> World'}));
});
