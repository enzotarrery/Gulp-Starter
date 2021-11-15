// Plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const w3cjs = require('gulp-w3cjs');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
const sass = require('gulp-dart-sass');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');

// Variables
const srcFolder = './src/';
const distFolder = './dist/';
const paths = {
  html: {
    src: './src/**/*.html',
    dest: './dist/',
  },
  css: {
    src: './src/assets/css/**/*.css',
    dest: './dist/assets/css/',
  },
  scss: {
    src: './src/assets/scss/**/*.scss',
    dest: './dist/assets/css',
  },
  js: {
    src: './src/assets/js/**/*.js',
    dest: './dist/assets/js/',
  },
  images: {
    src: './src/assets/img/**/*',
    dest: './dist/assets/img/',
  },
};

// Launch of a server from a directory
function browserSyncDev() {
  browserSync.init({
    server: {
      baseDir: srcFolder,
    },
    port: 3000,
  });
}

// Distribution clearer
function clear() {
  return del([distFolder]);
}

// Copy and minifying of the project files (html, scss, css, js & images)
function html() {
  return gulp
    .src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}
function css() {
  return gulp
    .src(paths.css.src, { since: gulp.lastRun(css) })
    .pipe(plumber())
    .pipe(csscomb())
    .pipe(autoprefixer({ cascade: clear }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}
function scss() {
  return gulp
    .src(paths.scss.src, { since: gulp.lastRun(scss) })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}
function js() {
  return gulp
    .src(paths.js.src, { since: gulp.lastRun(js) })
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}
function images() {
  return gulp
    .src(paths.images.src, { since: gulp.lastRun(images) })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

// Watcher
function watch() {
  gulp.watch(paths.scss.src, scss);
  gulp.watch(paths.html.src).on('change', () => {
    gulp.src(paths.html.src).pipe(plumber()).pipe(w3cjs());
    browserSync.reload();
  });
}

// Variables
const launch = gulp.parallel(watch, browserSyncDev);
const dev = gulp.series(scss, launch);
const build = gulp.series(clear, html, scss, css, js, images);

// Exports
exports.default = dev;
exports.dev = dev;
exports.build = build;
exports.clear = clear;
