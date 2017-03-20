var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    nunjucks = require('gulp-nunjucks'),
    nunjucksRender = require('gulp-nunjucks-render'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSymbols = require('gulp-svg-symbols'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pump = require('pump');

var sassOptions = { outputStyle: 'expanded' };

gulp.task('sass', function() {
    gulp
        .src('./scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write('./build/css'))
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});


gulp.task('uglify', function (cb) {
  pump([
        gulp.src('js/*.js'),
        uglify(),
        gulp.dest('./build/js')
    ],
    cb
  );
});

gulp.task('html', function() {
    nunjucksRender.nunjucks.configure(['./build']);
    return gulp.src('./html/*')
    .pipe(nunjucksRender())
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());

});


gulp.task('imagemin', function() {
    gulp
        .src(['source/*.jpg', 'source/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});

gulp.task('svg', function() {
    return gulp.src('./source/*.svg')
        .pipe(svgSymbols())
        .pipe(gulp.dest("./build/svg"));
});



gulp.task('bs-reload', function() {
    browserSync.reload();
});


gulp.task('watch', ['sass', 'uglify', 'html', 'imagemin', 'svg'], function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    gulp.watch('./scss/*.scss', ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch(['./pages/*'], ['html']);
    gulp.watch('./js/*.js', ['compress']);
    gulp.watch('./source/*.svg', ['sprites']);
    gulp.watch(['source/*.jpg', 'source/*.png'], ['imagemin']);
});

gulp.task('default', ['watch']);
