// Plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const csscomb = require('gulp-csscomb');
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
  js: {
    src: './src/assets/js/**/*.js',
    dest: './dist/assets/js/',
  },
  images: {
    src: './src/assets/img/**/*',
    dest: './dist/assets/img/',
  },
};
const dev = gulp.parallel(watch, browserSyncDev);
const build = gulp.series(clear, html, css, js, images);

// Launch of a server from a directory
function browserSyncDev() {
  browserSync.init({
    server: {
      baseDir: srcFolder,
    },
    port: 3000,
  });
}

// Watcher
function watch() {
  gulp.watch([paths.html.src, paths.css.src, paths.js.src])
    .on('change', browserSync.reload);
}

// Distribution clearer
function clear() {
  return del([distFolder]);
}

// Copy and minifying of the project files (html, css, scss, js & images)
function html() {
  return (
    gulp
      .src(paths.html.src, { since: gulp.lastRun(html) })
      .pipe(plumber())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(paths.html.dest))
      .pipe(browserSync.stream())
  );
}
function css() {
  return (
    gulp
      .src(paths.css.src, { since: gulp.lastRun(css) })
      .pipe(plumber())
      .pipe(csscomb())
      .pipe(autoprefixer({ cascade: clear }))
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(concat('main.css'))
      .pipe(gulp.dest(paths.css.dest))
      .pipe(browserSync.stream())
  );
}
function js() {
  return (
    gulp
      .src(paths.js.src, { since: gulp.lastRun(js) })
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest(paths.js.dest))
      .pipe(browserSync.stream())
  );
}
function images() {
  return (
    gulp
      .src(paths.images.src, { since: gulp.lastRun(images) })
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest(paths.images.dest))
      .pipe(browserSync.stream())
  );
}

// Exports
exports.default = dev;
exports.dev = dev;
exports.build = build;
