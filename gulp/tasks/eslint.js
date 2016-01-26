'use strict';

/**
 * Eslint task runner
 */
const gulp = require('gulp'),
      eslint = require('gulp-eslint'),
      config = require('./../config');

gulp.task('eslint', () => {
    return gulp.src([config.path.js.files])
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('eslint:tasks', () => {
    return gulp.src(config.path.tasks.files)
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('eslint:tests', () => {
    return gulp.src(config.path.tests.files)
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});