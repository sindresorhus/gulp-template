'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var template = require('./');

it('should compile Lodash templates', function (cb) {
	var stream = template({people: ['foo', 'bar']});

	stream.on('data', function (data) {
		assert.equal(data.contents.toString(), '<li>foo</li><li>bar</li>');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		contents: new Buffer('<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>')
	}));

	stream.end();
});
