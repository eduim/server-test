/* eslint-disable no-unused-vars */
import gulp from 'gulp'
import removeCode from 'gulp-remove-code'
import { deleteAsync } from 'del'

function stripSolutions() {
  return gulp
    .src([
      './**/*.js',
      './**/*.ts',
      './**/*.jsx',
      './**/*.ts',
      './**/*.yml',
      './*.yml',
      './**/*.tsx',
      './**/*.html',
      './**/*.css',
      '!node_modules/**',
      '!**/node_modules/**',
      '!gulp-dist/**',
      '!.parcel-cache/**',
      '!dist/**',
      '!gulpfile.js',
      '!/**/*.prisma',
    ])
    .pipe(removeCode({ exercise: true }))
    .pipe(gulp.dest('./gulp-dist'))
}

function exportRestFiles() {
  return gulp
    .src(
      [
        './**/*',
        '!.github/workflows/publish-solution.yml',
        '!.git/**/*',
        '!./**/*.js',
        '!./**/*.jsx',
        './**/*.yml',
        './*.yml',
        '!./**/*.ts',
        '!./**/*.tsx',
        '!./**/*.html',
        '!./**/*.css',
        '!node_modules/**',
        '!**/node_modules/**',
        '!gulp-dist/**',
        '!.parcel-cache/**',
        '!dist/**',
        '!gulpfile.js',
      ],
      { dot: true }
    )
    .pipe(gulp.dest('./gulp-dist'))
}

function filterFiles() {
  return gulp
    .src(['.github/workflows/build.yml', 'README.md'], { dot: true, base: '.' })
    .pipe(gulp.dest('./gulp-dist'))
}

function deleteFiles() {
  return deleteAsync(['./gulp-dist/server/prisma', './**/.env'])
}

export default gulp.series(stripSolutions, exportRestFiles, deleteFiles)
