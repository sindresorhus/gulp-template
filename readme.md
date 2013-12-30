# [gulp](https://github.com/wearefractal/gulp)-template [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-template.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-template)

> Compile [Lo-Dash templates](http://lodash.com/docs#template)

*Lo-Dash is like Underscore, but faster and better.*


## Install

Install with [npm](https://npmjs.org/package/gulp-template)

```
npm install --save-dev gulp-template
```


## Example

### `src/greeting.html`

```erb
<h1>Hello <%= name %></h1>
```

### `gulpfile.js`

```js
var gulp = require('gulp');
var template = require('gulp-template');

gulp.task('default', function () {
	gulp.src('src/greeting.html')
		.pipe(template({name: 'Sindre'}))
		.pipe(gulp.dest('dist'));
});
```

### `dist/greeting.html`

```html
<h1>Hello Sindre</h1>
```


## API

See the [Lo-Dash `_.template` docs](http://lodash.com/docs#template).


### template(data, options)


#### data

Type: `Object`

The data object used to populate the text.


#### options

Type: `Object`

[Lo-Dash `_.template` options](http://lodash.com/docs#template).


## Notes

If you use [grunt](http://gruntjs.com) instead of gulp, but want to perform a similar task, use [grunt-template](https://github.com/mathiasbynens/grunt-template).


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
