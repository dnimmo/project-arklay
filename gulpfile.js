// ============================================================
// Gulp tasks for projectMud. 
// ============================================================

// ==================================================
// Load modules
// ==================================================

var gulp 	= require('gulp');
var html  = require('gulp-minify-html');
var	sass 	= require('gulp-sass');
var	uglify	= require('gulp-uglify');
var	rename	= require('gulp-rename');
var	lint	= require('gulp-jslint');
var	watch	= require('gulp-watch');
var browserSync = require('browser-sync').create();
var karma = require('karma').server;

// ==================================================
// Root and destination directories - Change these to suit!
// ==================================================

var rootDir = './src';
var destDir = './build'; 

// ==================================================
// HTML files to be watched
// ==================================================

var htmlFiles = rootDir + '/**/*.html';

// ==================================================
// SCSS files to be watched
// ==================================================

var	scssFiles = rootDir + '/**/*.scss';

// ==================================================
// JS files to be watched - ignore any minified files
// ==================================================

var	 jsFiles = [
		rootDir + '/**/*.js',
		'!'+rootDir+'/**/*.min.js'
	];

// ==================================================
// Gulp tasks
// ==================================================

// Default task runs all of the available tasks, but you can run any of them individually by running 'gulp [taskname]'
// -------------------------------------------------------------------------------------------------------------------

gulp.task('default', ['test', 'process-html', 'process-stylesheets', 'process-javascript', /*'js-lint', */ 'browser-sync', 'watch']);

// Run tests from src/tests
// ------------------------

gulp.task('test', function (done) {
  console.log('Running tests');
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
  console.log('Finished running tests');
});

// Minify HTML files [gulp-minify-html]
// ------------------------------------

gulp.task('process-html', function(){
  var options = {
    quotes: true
  };
  return gulp.src(htmlFiles)
  .pipe(html(options))
  .pipe(gulp.dest(destDir));
});

// Process SCSS files [gulp-sass]
// ------------------------------

gulp.task('process-stylesheets', function(){
	console.log('Processing SCSS files')
	// Look for all SCSS files
	gulp.src(scssFiles)
	.pipe(sass().on('error', function(err){
		// Log errors
		console.log(err);
	}))
	// Leave processed file in the same location as the original
	.pipe(gulp.dest(destDir));
	console.log('Finished processing SCSS files');
})

// Minify JS files [gulp-uglify]
// -----------------------------

gulp.task('process-javascript', function(){
	console.log('Minifying JS');
	// Watch JS files, but ignore already minified ones
	gulp.src(jsFiles)
	.pipe(uglify())
	// Add '.min' to minified files
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest(destDir));
	console.log('Finished minifying JS');
});

// JS Lint
// -------

gulp.task('js-lint', function(){
  console.log('Starting JS Lint');
	return gulp.src(jsFiles)
	.pipe(lint({
    devel: true,
    reporter: 'default'
  }))
  .on('error', function (error) {
    console.error(String(error));
  });
  console.log('Finished JS Lint');
});

// BrowserSync
// -----------

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir : destDir
    }
  });
  // Watch files for changes, then reload on change
  gulp.watch(destDir + '/**/*.hrml').on('change', browserSync.reload);
  gulp.watch(destDir + '/**/*.js').on('change', browserSync.reload);
  gulp.watch(destDir + '/**/*.css').on('change', browserSync.reload);
});

// Watch files for updates
// -----------------------

gulp.task('watch', function(){
  // Watch HTML files
  gulp.watch(htmlFiles, ['process-html']);
	// Watch SCSS files
	gulp.watch(scssFiles, ['process-stylesheets']);
	// Watch JS files
	gulp.watch(jsFiles, ['test', 'process-javascript']/*, 'js-lint']*/);
})