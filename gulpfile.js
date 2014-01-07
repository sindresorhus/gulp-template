var gulp = require('gulp');
var template = require('gulp-template');

gulp.task('default', function () {
    gulp.src('test/templates/template.md')
        .pipe(template(true))
        .pipe(gulp.dest('test/result'));
});
