'use strict';

var gulp = require('gulp'),
    jsImport = require('gulp-js-import'),
    minify = require('gulp-minify'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass'),
  sassGlob = require('gulp-sass-glob'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('autoprefixer'),
  sortCSSmq = require('sort-css-media-queries'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  gulpif = require('gulp-if'),
  mqpacker = require("css-mqpacker"),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  fileInclude = require('gulp-file-include'),
  fs = require('fs'),
  dirs = {
    'source': {
      'fonts': './source/fonts/*.*',
      'fontsFolder': './source/fonts/',
      'html': './source/pages/*.html',
      'html_watch': './source/pages/**/*.html',
      'sass': ['./source/sass/*.*', './source/sass/*.scss'],
      'sassRoot': 'source/sass/',
      'sass_watch': 'source/sass/**/*.scss',
      'img': ['./source/img/*.png', './source/img/*.svg', './source/img/*.jpg', './source/img/**/*.jpg', './source/img/**/*.png', './source/img/**/*.svg'],
        'js': './source/js/main.js',
        'jsAll': './source/js/*.js'
    },
    'build': {
      'css': './build/css/',
      'cssBuild':'../../../../../Applications/MAMP/htdocs/looqme.local/themes/new/css',
      'cssVendor': './build/css/vendor/',
      'fonts': './build/fonts/',
      'html': './build',
      'img': './build/img/',
        'js': './build/js',
        'jsBuild': '../../../../../Applications/MAMP/htdocs/looqme.local/themes/new/js',
    }
  };

//fonts
gulp.task('fonts', function() {
  gulp.src(dirs.source.fonts)
    .pipe(gulp.dest(dirs.build.fonts));
});

//html
gulp.task('html', function() {
  gulp.src(dirs.source.html)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(dirs.build.html))
    .pipe(connect.reload());
});

//livereload server
gulp.task('connect', function() {
  connect.server({
    root: dirs.build.html,
    livereload: true,
    port: 9999
  });
});

//sass
gulp.task('compileSass', function() {

  var processors = [
    autoprefixer({ browsers: ['last 2 version', 'IE 10', 'IE 11'], cascade: false }),
    mqpacker({ sort: sortCSSmq.desktopFirst })
  ];

  return gulp.src(dirs.source.sass)
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.build.css))
    .pipe(gulp.dest(dirs.build.cssBuild))
    .pipe(connect.reload());
});

//js
gulp.task('js', function(){
    return gulp.src(dirs.source.js)
        .pipe(jsImport({hideConsole: true}))
        .pipe(concat('main.min.js'))
        .pipe(minify({
            compress: true
        }))
        .pipe(gulp.dest(dirs.build.js))
        .pipe(gulp.dest(dirs.build.jsBuild))
});

//img
gulp.task('images', function() {
  return gulp.src(dirs.source.img)
    .pipe(plumber())
    .pipe(gulpif(/[.](png|jpeg|jpg|svg)$/, imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    })))
    .pipe(gulp.dest(dirs.build.img))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(dirs.source.html_watch, ['html']);
  gulp.watch(dirs.source.sass, ['compileSass']);
  gulp.watch(dirs.source.sass_watch, ['compileSass']);
  gulp.watch(dirs.source.jsAll, ['js']);
  gulp.watch(dirs.source.img, ['images']);
});

gulp.task('default', ['fonts', 'images', 'html', 'connect', 'compileSass', 'js', 'watch']);