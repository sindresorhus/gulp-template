import {Buffer} from 'node:buffer';
import test from 'ava';
import {pEvent} from 'p-event';
import Vinyl from 'vinyl';
import gulpData from 'gulp-data';
import gulpTemplate, {precompile} from './index.js';

test('should compile Lodash templates', async t => {
	const stream = gulpTemplate({people: ['foo', 'bar']});
	const promise = pEvent(stream, 'data');
	stream.write(new Vinyl({contents: Buffer.from('<% _.forEach(people, function (name) { %><li><%- name %></li><% }); %>')}));
	stream.end();

	const data = await promise;
	t.is(data.contents.toString(), '<li>foo</li><li>bar</li>');
});

test('should support data via gulp-data', async t => {
	const stream = gulpData(file => ({dd: file.path}));
	const finalStream = stream.pipe(gulpTemplate({dt: 'path'}));

	stream.write(new Vinyl({path: 'foo.txt', contents: Buffer.from('<dt><%- dt %></dt><dd><%- dd %></dd>')}));
	stream.write(new Vinyl({path: 'bar.txt', contents: Buffer.from('<dt><%- dt %></dt><dd><%- dd %></dd>')}));
	stream.end();

	const result = await finalStream.toArray();

	t.deepEqual(
		result.map(file => file.contents.toString()).sort(),
		['<dt>path</dt><dd>bar.txt</dd>', '<dt>path</dt><dd>foo.txt</dd>'].sort(),
	);
});

test('should support Lo-Dash options with gulp-data', async t => {
	const options = {variable: 'data', imports: {dt: 'path'}};
	const stream = gulpData(file => ({dd: file.path}));
	const finalStream = stream.pipe(gulpTemplate(null, options));

	stream.write(new Vinyl({path: 'foo.txt', contents: Buffer.from('<dt><%- dt %></dt><dd><%- data.dd %></dd>')}));
	stream.write(new Vinyl({path: 'bar.txt', contents: Buffer.from('<dt><%- dt %></dt><dd><%- data.dd %></dd>')}));
	stream.end();

	const result = await finalStream.toArray();

	t.deepEqual(
		result.map(file => file.contents.toString()).sort(),
		['<dt>path</dt><dd>bar.txt</dd>', '<dt>path</dt><dd>foo.txt</dd>'].sort(),
	);
});

test('should merge gulp-data and data parameter', async t => {
	const stream = gulpData(() => ({people: ['foo', 'bar'], nested: {a: 'one', b: 'two'}}));
	const promise = pEvent(stream, 'data');
	stream.pipe(gulpTemplate({heading: 'people', nested: {a: 'three', c: 'four'}}));
	stream.write(new Vinyl({contents: Buffer.from('<h1><%= heading %></h1><% _.forEach(people, function (name) { %><li><%- name %></li><% }); %><%= nested.a %>,<%= nested.b %>,<%= nested.c %>')}));
	stream.end();

	const data = await promise;
	t.is(data.contents.toString(), '<h1>people</h1><li>foo</li><li>bar</li>three,two,four');
});

test('should not alter gulp-data or data parameter', async t => {
	const stream = gulpData(file => ({contents: file.contents.toString()}));
	const parameter = {foo: 'foo', bar: 'bar', foobar: ['foo', 'bar']};
	const finalStream = stream.pipe(gulpTemplate(parameter));

	stream.write(new Vinyl({contents: Buffer.from('foo')}));
	stream.end();

	const result = await finalStream.toArray();

	t.deepEqual(result.map(x => x.data), [{contents: 'foo'}]);
	t.deepEqual(parameter, {foo: 'foo', bar: 'bar', foobar: ['foo', 'bar']});
});

test('should work with no data supplied', async t => {
	const stream = gulpTemplate();
	const promise = pEvent(stream, 'data');
	stream.write(new Vinyl({contents: Buffer.from('')}));
	stream.end();

	const data = await promise;
	t.is(data.contents.toString(), '');
});

test('should precompile Lodash templates', async t => {
	const stream = precompile();
	const promise = pEvent(stream, 'data');
	stream.write(new Vinyl({contents: Buffer.from('<h1><%= heading %></h1>')}));
	stream.end();

	const data = await promise;
	t.true(data.contents.toString().includes('function'));
});

test('should support Lo-Dash options when precompiling', async t => {
	const options = {variable: 'data'};
	const stream = precompile(options);
	const promise = pEvent(stream, 'data');
	stream.write(new Vinyl({contents: Buffer.from('<h1><%= heading %></h1>')}));
	stream.end();

	const data = await promise;
	t.true(data.contents.toString().includes('function'));
});
