var gulp = require('gulp');
var args = gulp.env;

gulp.task('default', function (cb) {
    console.log(args);
});
