import {Buffer} from 'node:buffer';
import _ from 'lodash';
import {gulpPlugin} from 'gulp-plugin-extras';

function compile(options, data, render) {
	return gulpPlugin('gulp-template', file => {
		const template = _.template(file.contents.toString(), options);
		file.contents = Buffer.from(render ? template(_.merge({}, file.data, data)) : template.toString());
		return file;
	});
}

export default function gulpTemplate(data, options) {
	return compile(options, data, true);
}

export function precompile(options) {
	return compile(options);
}
