var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('hello', function(){
  console.log('Hello Zell');
});

//--------DEVELOPMENT PROCESS ----------------------
gulp.task('sass',function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) //Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

//--- group task to execute every development task
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss',['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  //Other watchers
})

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})
//-------------------  END   --------------------------


//---------------OPTIMIZATION PROCESS------------------
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function(){
  return del.sync('dist');
})

//--------------------  END   --------------------------

gulp.task('build',function(callback){
  runSequence('clean:dist','sass', ['useref', 'fonts'], callback)
})

//---- Task to be executed with only gulp command  ----
gulp.task('default', function(callback){
  runSequence(['sass','browserSync','watch'],callback)
})