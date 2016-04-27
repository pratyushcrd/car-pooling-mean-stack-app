// Require
var gulp  = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
// Tasks
gulp.task('default', function() {
  gulp.src(['./client/assets/js/angular/vendor/angular.js','./client/assets/js/angular/vendor/animate.js',
  	'./client/assets/js/angular/vendor/resource.js','./client/assets/js/angular/vendor/route.js',
  	'./client/assets/js/angular/vendor/socketio.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./client/assets/js/angular/'));

    gulp.src(['./client/assets/css/nga.min.css', 
    	'./client/assets/css/bootstrap.css', 
    	'./client/assets/js/gritter/css/jquery.gritter.css'])
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./client/assets/css/'))
});
