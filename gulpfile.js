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


gulp.task('sass', function(ss) {
    pump([
            gulp.src("./scss/**/*.scss"),
            autoprefixer(),
            sourcemaps.init(),
            sass().on('error', sass.logError),
            sourcemaps.write('./'),
            gulp.dest("./public_html/css"),
            browserSync.stream()
        ],
        ss
    );
});



gulp.task('uglify', function(cb) {
    pump([
            gulp.src('js/*.js'),
            uglify(),
            gulp.dest('./public_html/js'),
            browserSync.stream()
        ],
        cb
    );

});



gulp.task('html', function(nj) {
    nunjucksRender.nunjucks.configure(['./public_html']);

    pump([

            gulp.src('./html/*'),
            nunjucksRender(),
            gulp.dest('./public_html'),
            browserSync.stream()
        ],
        nj
    );

});




gulp.task('imagemin', function() {
    return gulp
        .src(['bitmaps/*.jpg', 'bitmaps/*.png'])
        .pipe(imagemin())
        .pipe(gulp.dest('./public_html/img'))
                .pipe(browserSync.stream());

});

gulp.task('svg', function() {
    return gulp.src('./vectors/*.svg')
        .pipe(svgSymbols())
        .pipe(gulp.dest("./public_html/svg"));
});




gulp.task('watch', ['sass', 'uglify', 'html', 'imagemin', 'svg'], function() {
    browserSync.init({
        server: {
            baseDir: './public_html'
        }
    });
    gulp.watch('./scss/*.scss', ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    gulp.watch(['./html/**/*'], ['html']);
    gulp.watch('./js/*.js', ['uglify']);
    gulp.watch('./vectors/*.svg', ['sprites']);
    gulp.watch(['./bitmaps/*.jpg', './bitmaps/*.png'], ['imagemin']);
});

gulp.task('default', ['watch']);
