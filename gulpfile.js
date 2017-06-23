var gulp = require('gulp');
var gulpSrc = require('gulp-src-ordered-globs');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var path = require('path');
var runSequence = require('run-sequence');
var swPrecache = require('sw-precache');

const BASE_DIR = './';
const DEST_DIR = './public/';

const cleanFilesList = [
  DEST_DIR + '**'
];

gulp.task('copy-files', function() {
  const copyDest = path.join(DEST_DIR);
  gulpSrc([
      BASE_DIR + '**/*',
      '!' + BASE_DIR + 'scss{,/**}',
      '!' + BASE_DIR + 'public{,/**}',
      '!' + BASE_DIR + 'node_modules{,/**}',
      '!' + BASE_DIR + 'functions{,/**}',
      '!' + BASE_DIR + '*.*',
      BASE_DIR + '*.{html,ico}',
      BASE_DIR + 'manifest.json'
    ])
    .pipe(plumber())
    .pipe(changed(copyDest))
    .pipe(gulp.dest(copyDest));
});

gulp.task('sass', function () {
  return gulp
    .src('./scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./styles/'))
    .pipe(minifyCss({}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./styles/'));
});

gulp.task('generate-sw', function() {
  var swOptions = {
    staticFileGlobs: [
      './*.html',
      './images/*.{png,svg,gif,jpg}',
      './scripts/*.js',
      './styles/*.css'
    ],
    stripPrefix: '.',
    runtimeCaching: [{
      urlPattern: /^https:\/\/whitehouseengineer\.firebaseapp\.com/,
      handler: 'networkFirst',
      options: {
        cache: {
          name: 'fm-v1'
        }
      }
    }]
  };
  return swPrecache.write('./service-worker.js', swOptions);
});

gulp.task('clean', function() {
  return del.sync(cleanFilesList);
});

gulp.task('serve', ['sass', 'generate-sw'], function() {
  gulp.watch('./scss/*.scss', ['sass']);
  browserSync({
    notify: false,
    logPrefix: 'FM',
    server: {
      baseDir: "."
    },
    open: false
  });
  gulp.watch([
    './*.html',
    './scripts/*.js',
    './styles/*.css',
    '!./service-worker.js',
    '!./gulpfile.js',
    '!./public/**'
  ], ['generate-sw'], browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('sass', 'generate-sw', 'clean', 'copy-files', callback);
});

gulp.task('default', ['serve']);