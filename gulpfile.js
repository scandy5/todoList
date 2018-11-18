var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify'),
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	imagemin 	  = require('gulp-imagemin'),
	clean 		  = require('gulp-clean'),
	runSequence	  = require('run-sequence'),
	notify        = require("gulp-notify");

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream())
});

gulp.task('images', () =>
    gulp.src('app/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

gulp.task('fonts', () =>
	gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
);

gulp.task('html', () =>
	gulp.src('app/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
);

gulp.task('clean', () => 
	gulp.src('dist')
		.pipe(clean({force: true}))
);

gulp.task('js', function() {
	return gulp.src([
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('build', function(callback){
	runSequence('clean', ['images', 'js', 'styles', 'fonts', 'html'], callback);
});

gulp.task('watch', ['build', 'browser-sync'], function() {
	gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/img/**/*'), ['images'];
	gulp.watch('app/fonts/**/*'), ['fonts'];
	gulp.watch('app/*.html', ['html']);
});

gulp.task('default', ['watch']);
