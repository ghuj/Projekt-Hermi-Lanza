/**
 * Devtips Starter Kit Gulp configuration file
 * Feel free to modify this file as you need
 * if you find any bug or error, please submit an issue
 */
// Include gulp plugins
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const { deleteAsync } = require('del');
const config = require('./config.js')();
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const size = require('gulp-size');
const pug = require('gulp-pug');
const jshint = require('gulp-jshint');
const deporder = require('gulp-deporder');
const stripDebug = require('gulp-strip-debug');

// Configs
const devBuild = (config.environment.trim().toLowerCase() !== 'production');
const source = config.source.endsWith('/') ? config.source : config.source + '/';
const dest = config.build.endsWith('/') ? config.build : config.build + '/';
const pkg = require('./package.json'),
  images = {
    in: source + (config.images.endsWith('/') ? config.images + '**/*.*' : config.images + '/**/*.*'),
    out: dest + config.images
  },
  views = {
    in: source + (config.views.endsWith('/') ? config.views + '*.pug' : config.views + '/*.pug'),
    out: dest,
    watch: source + (config.views.endsWith('/') ? config.views + '**/*' : config.views + '/**/*')
  },
  styles = {
    in: source + config.sass,
    watch: [source + config.sass.substring(0, (config.sass.lastIndexOf('/') + 1)) + '**/*'],
    out: dest + (config.css.endsWith('/') ? config.css : config.css + '/'),
    sassOpt: {
      outputStyle: config.sassOptions.outputStyle || 'expanded',
      imagePath: config.sassOptions.imagePath,
      precision: config.sassOptions.precision || 3,
      errLogToConsole: true
    }
  },
  js = {
    in: source + (config.jsDir.endsWith('/') ? config.jsDir + '**/*' : config.jsDir + '/**/*'),
    out: dest + config.jsDir,
    filename: config.jsName
  },
  syncOpt = {
    server: {
      baseDir: dest,
      index: config.syncOptions.index || 'index.html'
    },
    open: config.syncOptions.open || false,
    notify: config.syncOptions.notify || true
  },
  pugOptions = { pretty: devBuild, basedir: source + config.views },
  vendors = {
    in: source + (config.vendors.endsWith('/') ? config.vendors + '**/*' : config.vendors + '/**/*'),
    out: dest + (config.vendors.endsWith('/') ? config.vendors : config.vendors + '/'),
    watch: [source + (config.vendors.endsWith('/') ? config.vendors + '**/*' : config.vendors + '/**/*')]
  };

console.log(pkg.name + ' ' + pkg.version + ' ' + config.environment + ' build');

/**
 * Tasks
 */
//Clean the build folder
gulp.task('clean', async () => {
  console.log('-> Cleaning build folder');
  await deleteAsync([dest + '**/*']);
});

// Compile Javascript files
gulp.task('js', async () => {
  console.log(devBuild ? '-> Compiling Javascript for Development' : '-> Compiling Javascript for Production');
  
  if (!devBuild) {
    await deleteAsync([dest + 'js/*']);
  }

  return gulp.src(js.in)
    .pipe(plumber())
    .pipe(deporder())
    .pipe(concat(js.filename))
    .pipe(devBuild ? gulp.dest(js.out) : uglify().pipe(gulp.dest(js.out)));
});

// Update images on build folder
gulp.task('images', () => {
  return gulp.src(images.in)
    .pipe(newer(images.out))
    .pipe(gulp.dest(images.out));
});

// Update Favicon on build folder
gulp.task('favicon', () => {
  return gulp.src(source + config.favicon)
    .pipe(newer(dest))
    .pipe(gulp.dest(dest));
});

// Copy all vendors to build folder
gulp.task('vendors', () => {
  return gulp.src(vendors.in)
    .pipe(newer(vendors.out))
    .pipe(gulp.dest(vendors.out));
});

//Compile Pug templates
gulp.task('pug', () => {
  console.log('-> Compiling Pug Templates');
  return gulp.src(views.in)
    .pipe(plumber())
    .pipe(newer(views.out))
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(views.out));
});

// Compile Sass styles
gulp.task('sass', () => {
  return gulp.src(styles.in)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: config.sassOptions.outputStyle || 'expanded',
      imagePath: config.sassOptions.imagePath,
      precision: config.sassOptions.precision || 3,
      errLogToConsole: true
    }))
    .on('error', sass.logError)
    .pipe(cleanCSS({
      compatibility: 'ie11',
      level: {
        1: {
          specialComments: 0
        }
      }
    }))
    .pipe(gulp.dest(styles.out))
    .pipe(browsersync.stream());
});

// Start BrowserSync
gulp.task('browsersync', () => {
  console.log('-> Starting BrowserSync');
  browsersync.init(syncOpt);
});

// Build Task
gulp.task('build', 
  gulp.series('clean', 
    gulp.parallel('sass', 'pug', 'js', 'images', 'vendors', 'favicon')
  )
);

// Watch Task
gulp.task('watch', gulp.series('build', () => {
  browsersync.init(syncOpt);
  
  gulp.watch(styles.watch, gulp.series('sass'));
  gulp.watch(views.watch, gulp.series('pug'));
  gulp.watch(js.in, gulp.series('js'));
  gulp.watch(vendors.watch, gulp.series('vendors'));
  gulp.watch(images.in, gulp.series('images'));

  // Watch for any changes in the dest directory
  gulp.watch(dest + '**/*').on('change', browsersync.reload);
}));

// Compile and Watch task
gulp.task('start', gulp.series('build', 'watch'));

// Help Task
gulp.task('help', (done) => {
  console.log('');
  console.log('===== Help for DevTips Starter Kit =====');
  console.log('');
  console.log('Usage: gulp [command]');
  console.log('The commands for the task runner are the following.');
  console.log('-------------------------------------------------------');
  console.log('       clean: Removes all the compiled files on ./build');
  console.log('          js: Compile the JavaScript files');
  console.log('        pug: Compile the Pug templates');
  console.log('        sass: Compile the Sass styles');
  console.log('      images: Copy the newer to the build folder');
  console.log('     favicon: Copy the favicon to the build folder');
  console.log('     vendors: Copy the vendors to the build folder');
  console.log('       build: Build the project');
  console.log('       watch: Watch for any changes on the each section');
  console.log('       start: Compile and watch for changes (for dev)');
  console.log('        help: Print this message');
  console.log(' browsersync: Start the browsersync server');
  console.log('');
  done(); // Signal task completion
});

// Default Task
gulp.task('default', gulp.series('help', (done) => {
  done(); // Signal task completion
}));

/**
 * Custom functions
 */
function log(msg) {
  console.log(msg);
}

