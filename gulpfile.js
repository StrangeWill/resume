var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    browserSync = require('browser-sync'),
    notify      = require('gulp-notify'),
    imagemin    = require('gulp-imagemin'),
    pngcrush    = require('imagemin-pngcrush'),
    cp          = require('child_process');


var messages = {
  jekyllBuild: '<span style="color: grey;">Running:</span> $ jekyll build'
};

gulp.task('jekyll-build', function(done) {
   browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

gulp.task('compile-sass', function() {
   return sass('sass/', { style: 'compressed' })
       .on('error', notify.onError(function(error) {
           return error.message;
       }))
       .pipe(gulp.dest('css'));
});


gulp.task('browser-sync', ['compile-sass', 'jekyll-build'], function() {
   browserSync.init(['_site/assets/css/*.css'], {
        server: {
            baseDir: '_site'
        }
    });
});

gulp.task('imagemin', function() {
   return gulp.src('images/**/*')
       .pipe(imagemin({
           progressive: true,
           svgoPlugins: [{ removeViewBox: false }],
           use: [pngcrush()]
       }))
       .pipe(gulp.dest('_site/images/'));
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch(['sass/**/*.scss'], ['compile-sass', 'jekyll-rebuild']);
    gulp.watch(['images/**/*'], ['imagemin', 'jekyll-rebuild']);
    gulp.watch([
        '*.html',
        '_data/*',
        '_includes/*',
        '_layouts/*',
        '_config.yaml',
    ], ['jekyll-rebuild']);
});
