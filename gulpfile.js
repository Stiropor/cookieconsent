var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyJS = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var deleteDirs = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var bump = require('gulp-bump');
var yargs = require('yargs');
var diff = require('gulp-diff');


var buildFolder = './build';
var jsBuildFiles = [
  './src/cookieconsent.js'
];
var sassBuildFiles = [
  './src/scss/cookieconsent.scss'
];


gulp.task('cleanup:begin', function () {
  return deleteDirs([buildFolder]);
});

gulp.task('minify:js', function () {
  return gulp.src(jsBuildFiles)            // get files
    .pipe(minifyJS())                      // minify them
    .pipe(concat('cookieconsent.min.js'))  // combine them
    .pipe(gulp.dest(buildFolder));          // save under a new name
});

gulp.task('minify:sass', function () {
	return gulp.src(sassBuildFiles)				// get files
		.pipe(sass())							// compile scss sass files
		.pipe(minifyCSS())                      // minify them
		.pipe(concat('cookieconsent.min.css'))  // combine them
		.pipe(gulp.dest(buildFolder));			// save under a new name
});

gulp.task('bump', function(callback) {
  return gulp.src(['./bower.json', './package.json'])
             .pipe(bump({'version': yargs.argv.tag}))
             .pipe(gulp.dest('./'))
});

gulp.task('build', function(callback) {
  return runSequence('cleanup:begin', 'minify:js', 'minify:sass', callback);
});

gulp.task('verify', function(callback) {
  buildFolder = "./build-verify";
  return runSequence('cleanup:begin', 'minify:js', 'minify:sass', 'verify:diff', callback);
});

gulp.task('verify:diff', function(callback) {
  return gulp.src('./build/*')
             .pipe(diff('./build-verify'))
             .pipe(diff.reporter({ fail: true }));
});

gulp.task('build:release', function(callback) {
  if (yargs.argv.tag===undefined) {
    throw "A version number (e.g. 3.0.1) is required to build a release of cookieconsent"
  }

  return runSequence('build', 'bump', callback)
});

gulp.task('watch', function() {
  gulp.watch(sassBuildFiles.concat(jsBuildFiles), ['build']);
});

function _minify(opts) {
}
