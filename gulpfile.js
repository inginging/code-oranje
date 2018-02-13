// Include gulp modules
var gulp 		= require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var order 		= require('gulp-order');
var concat 		= require('gulp-concat');
var fileinclude = require('gulp-file-include');
var watch 		= require('gulp-watch');


var dir = {
	app: 'app/',
	dist: 'dist/'
};

var paths = {
	src: {
		scss: 	[dir.app + 'scss/**/*.scss'],
		html: 	[dir.app + '**/*.html'],
		js:		[dir.app + 'js/**/*.js'],
		img: 	[dir.app + 'img/*.{png,jpg,svg,gif}'],
		fonts: 	[dir.app + 'fonts/*.{eot,woff,woff2,ttf}']
	},
	dest: {
		css: 	dir.dist + 'css',
		html: 	dir.dist, 
		js:  	dir.dist + 'js',
		img: 	dir.dist + 'img',
		font: 	dir.dist + 'fonts'
	}
}


// Generate sass
gulp.task('sass', function() {
	return gulp.src(paths.src.scss)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.dest.css))
		.pipe(browserSync.stream());
});

// Concat files
gulp.task('scripts', function() {
  return gulp.src(paths.src.js)
  		.pipe(order(['modules/**/*.js', 'main.js'])) // @Todo file name in variable?	
		.pipe(concat('main.js'))  		// @Todo file name in variable?		
		.pipe(gulp.dest(paths.dest.js))
		.pipe(browserSync.stream());
});

// Include partials 
gulp.task('fileinclude', function() { 
	return gulp.src(dir.app + '*.html')
		.pipe(fileinclude())
	    .pipe(gulp.dest(dir.dist))
	    .pipe(browserSync.stream());
});


// Copy html task
gulp.task('copy-html', function() {
 	gulp.src(paths.src.html)
 		.pipe(gulp.dest(dir.dist));
});

// Copy img task
gulp.task('copy-img', function() {
 	gulp.src(paths.src.img)
 		.pipe(gulp.dest(dir.dist + 'img'));
});

// Copy fonts task
gulp.task('copy-fonts', function() {
 	gulp.src(paths.src.fonts)
 		.pipe(gulp.dest(dir.dist + 'fonts'));
});


// Build task
gulp.task('build', ['fileinclude', 'sass', 'scripts', 'copy-html', 'copy-img', 'copy-fonts']);


// Set up static server with browsersync
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './dist',
            routes: {
             '/bower_components': 'bower_components'
        	}
        }
    });

    // Watch tasks
    gulp.watch(paths.src.js, ['scripts']);
	gulp.watch(paths.src.scss, ['sass']);
	gulp.watch(paths.src.html, ['fileinclude']);
});

gulp.task('default', ['build', 'serve']);



