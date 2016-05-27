// ============================================================
// Gulp tasks for Project Arklay 
// ============================================================

// ==================================================
// Load modules
// ==================================================

const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const gulp 	= require('gulp')
const html  = require('gulp-minify-html')
const karma = require('karma').server
const	lint	= require('gulp-jslint')
const	rename	= require('gulp-rename')
const	sass 	= require('gulp-sass')
const scssLint = require('gulp-scss-lint')
const	uglify	= require('gulp-uglify')
const	watch	= require('gulp-watch')

// ==================================================
// Required directories - Change these to suit!
// ==================================================

const bowerComponentsDir = './bower_components'
const destDir = './build'
const rootDir = './src'

// ==================================================
// HTML files to be watched
// ==================================================

const htmlFiles = rootDir + '/**/*.html'

// ==================================================
// SCSS files to be watched
// ==================================================

const	scssFiles = rootDir + '/**/*.scss'

// ==========================================================
// Javascript files to be watched - ignore any test files
// ==========================================================

const	jsFiles = [
		rootDir + '/assets/**/*.js',
    rootDir + '/assets/**/*.min.js',
    '!'+rootDir+'/tests'
]

// ==================================================
// Bower components to be included
// ==================================================

const bowerComponents = [
    bowerComponentsDir + '/angular.js/angular.min.js',
    bowerComponentsDir + '/angular-ui-router/release/angular-ui-router.min.js',
]

// ==================================================
// Images
// ==================================================

const assets = [
    rootDir + '/**/images/*.*',
    rootDir + '/**/sounds/*.*'
]

// ==================================================
// Gulp tasks
// ==================================================

// Default task runs all of the available tasks, but you can run any of them individually by running 'gulp [taskname]'
// -------------------------------------------------------------------------------------------------------------------

gulp.task('default', [/*'test', */'move-bower-components', 'move-assets', 'process-html', 'process-stylesheets', 'scss-lint', 'process-javascript', /*'js-lint', */ 'browser-sync', 'watch'])

// Run tests from src/tests
// ------------------------

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done)
})

// Minify HTML files [gulp-minify-html]
// ------------------------------------

gulp.task('process-html', function(){
  var options = {
    quotes: true
  }
  return gulp.src(htmlFiles)
  .pipe(html(options))
  .pipe(gulp.dest(destDir));
})

// Process SCSS files [gulp-sass]
// ------------------------------

gulp.task('process-stylesheets', function(){
	console.log('Processing SCSS files')
	// Look for all SCSS files
	gulp.src(scssFiles)
	.pipe(sass().on('error', function(err){
		// Log errors
		console.log(err)
	}))
	// Leave processed file in the same location as the original
	.pipe(gulp.dest(destDir))
	console.log('Finished processing SCSS files')
})


// SCSS Lint
// ---------

gulp.task('scss-lint', function(){
  gulp.src(scssFiles)
  .pipe(scssLint());
})

// Minify JS files [gulp-concat, gulp-uglify]
// -----------------------------

gulp.task('process-javascript', function(){
	// Watch JS files, but ignore already minified ones
	return gulp.src(jsFiles)
  .pipe(babel())
  .pipe(concat('arklay.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(destDir+'/assets/scripts'))
})

// Copy necessary bower components to 'build'
// ------------------------------------------

gulp.task('move-bower-components', function(){
  console.log('Moving Bower components')
  return gulp.src(bowerComponents)
  // Additional path on destDir here as the bower_components don't live in src/assets/scripts
  .pipe(gulp.dest(destDir+'/assets/scripts'))
})

// Copy assets to 'build'
// ----------------------

gulp.task('move-assets', function(){
  console.log('Moving assets')
  return gulp.src(assets)
  .pipe(gulp.dest(destDir))
})

// JS Lint
// -------

gulp.task('js-lint', function(){
  console.log('Starting JS Lint')
	return gulp.src(jsFiles)
	.pipe(lint({
    devel: true,
    reporter: 'default'
  }))
  .on('error', function (error) {
    console.error(String(error))
  })
  console.log('Finished JS Lint')
})

// BrowserSync
// -----------

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir : destDir
    }
  })
  // Watch files for changes, then reload on change
  gulp.watch(destDir + '/**/*.html').on('change', browserSync.reload)
  gulp.watch(destDir + '/**/*.js').on('change', browserSync.reload)
  gulp.watch(destDir + '/**/*.css').on('change', browserSync.reload)
})

// Watch files for updates
// -----------------------

gulp.task('watch', function(){
  // Watch HTML files
  gulp.watch(htmlFiles, ['process-html'])
	// Watch SCSS files
	gulp.watch(scssFiles, ['process-stylesheets', 'scss-lint'])
	// Watch TS files
	gulp.watch(jsFiles, ['test', 'process-javascript']/*, 'js-lint']*/)
})
