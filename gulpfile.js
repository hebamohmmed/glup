const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")

const imagemin = require('gulp-imagemin');
function imgTask() {
    return gulp.src('project/pics/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}
exports.img = imgTask

//html task

const htmlmin = require('gulp-htmlmin');
function htmlTask() {
    return src('project/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}

exports.html = htmlTask


//js task
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsTask() {
    return src('project/js/**/*.js',{sourcemaps:true}) 
        .pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsTask


// css task

var cleanCss = require('gulp-clean-css');
function cssTask() {
    return src("project/css/**/*.css")
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssTask



// //sass task
// var sass = require('gulp-sass');
// function sassTask() {
//     return src(["project/sass/**/*.scss", "project/css/**/*.css"],{sourcemaps:true})
//         .pipe(sass()) 
//         .pipe(concat('style.sass.min.css'))
//         .pipe(cleanCss())
//         .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
// }

//watch task
function watchTask() {
  watch('project/*.html',series(htmlTask, reloadTask))
  watch('project/js/**/*.js',series(jsTask, reloadTask))
  watch(["project/css/**/*.css","project/sass/**/*.scss"], parallel(sassTask,reloadTask));
}
var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}
function reloadTask(done) {
  browserSync.reload()
  done()
}
exports.default =series( parallel(htmlTask,jsTask,cssTask,imgTask),serve,watchTask)




