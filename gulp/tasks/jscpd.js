'use strict';

/**
 * jscpd, finds duplicate code
 */
const gulp = require('gulp'),
      jscpd = require('gulp-jscpd'),
      config = require('./../config');

gulp.task('jscpd:js', () => {
    return gulp.src([config.path.js.files])
        .pipe(jscpd(config.jscpd));
});