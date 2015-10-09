/**
 * Project : mailchimp-it
 * File : gulpfile
 * Date : 19/09/2015
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 */

/*jslint indent: 4, maxlen: 100, node: true, vars: true, nomen: true */
(function () {
    'use strict';
    require('es6-promise').polyfill();

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        less = require('gulp-less'),
        autoprefixer = require('gulp-autoprefixer'),
        copy = require('gulp-contrib-copy'),
        sourcemaps = require('gulp-sourcemaps'),
        plumber = require('gulp-plumber'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        browserSync = require('browser-sync'),
        targetCSSDir = 'src/demo/css',
        targetLESSDir = 'src/demo/less';

    // Compile LESS
    // and save to target CSS directory
    gulp.task('css', function () {
        return gulp.src(targetLESSDir + '/style.less', {read: true})
            .pipe(plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(less().on('error', gutil.log))
            .pipe(autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false
            }))
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write())
            .pipe(rename({
                extname: '.css'
            }))
            .pipe(gulp.dest(targetCSSDir))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

    gulp.task('mailchimpit_css', function () {
        return gulp.src('src/mailchimp-it.less', {read: true})
            .pipe(plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(less().on('error', gutil.log))
            .pipe(autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false
            }))
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write())
            .pipe(rename({
                extname: '.css'
            }))
            .pipe(gulp.dest('dist/'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });

    gulp.task('copy', function () {
        return gulp.src('src/MailchimpIt.php')
            .pipe(copy())
            .pipe(gulp.dest('dist/'))
    });

    gulp.task('compress_js', function () {
        return gulp.src('src/mailchimp-it.js')
            .pipe(sourcemaps.init())
            .pipe(uglify({
                preserveComments: 'some'
            }))
            .pipe(rename({
                extname: '.min.js'
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/'));
    });

    gulp.task('serve', ['css'], function () {
        browserSync.init({
            open: false,
            proxy: 'http://mailchimpit'
        });

        gulp.watch(targetLESSDir + '/**/*.less', ['css', 'mailchimpit_css']);
        gulp.watch(['*.html', './**/**/*.php', './**/**/*.js'], browserSync.reload);
    });


    gulp.task('default', ['serve']);
    gulp.task('make', ['compress_js', 'copy', 'mailchimpit_css']);
}());