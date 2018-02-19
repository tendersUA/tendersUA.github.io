var gulp = require('gulp');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function () {

    browserSync.init({
        server: "./"
    });

    gulp.watch("sass/*.scss", ['styles']);
    gulp.watch('unminified_images/*', ['images']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: "index.html"
        },
    })
})

gulp.task('images', function () {
    return gulp.src('unminified_images/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest('images'))
});

gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('./css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('default', ['serve']);
