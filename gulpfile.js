var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var del = require('del');

var paths = {
    scripts: 'src/jquery.happymodal.js',
    styles: 'src/happymodal.css'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build'], cb);
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('jquery.happymodal.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'));
});

gulp.task('styles', ['clean'], function() {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(concat('happymodal.min.css'))
        .pipe(csso())
        .pipe(prefix("last 2 version", "ie 9", { cascade: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts', 'styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('watch', ['watch', 'scripts', 'styles']);
gulp.task('default', ['scripts', 'styles']);