import {Buffer} from 'node:buffer';
import _ from 'lodash';
import {gulpPlugin} from 'gulp-plugin-extras';

function compile(options, data, render) {
	return gulpPlugin('gulp-template', file => {
		const contents = file.contents.toString();

		try {
			const template = _.template(contents, options);
			file.contents = Buffer.from(render ? template(_.merge({}, file.data, data)) : template.toString());
			return file;
		} catch (error) {
			error.message = `${error.message} in ${file.path}`;
			error.fileName = file.path;
			throw error;
		}
	});
}

export default function gulpTemplate(data, options) {
	return compile(options, data, true);
}

export function precompile(options) {
	return compile(options);
}
