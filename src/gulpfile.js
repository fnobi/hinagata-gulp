var path = require('path');
var gulp = require('gulp');

var source = require('vinyl-source-stream');
var sass = require('gulp-ruby-sass');
var pleeease = require('gulp-pleeease');
var varline = require('varline').gulp;
var jade = require('gulp-jade');
var Koko = require('koko');
var awspublish = require('gulp-awspublish');
var rename = require('gulp-rename');
var notify = require('gulp-notify');

var util = require('./lib/task-util');


/* ========================================= *
 * const
 * ========================================= */
var PROJ_NAME = 'hinagata-gulp';

var SRC = '.';
var SRC_SASS = [ SRC, 'sass' ].join('/');
var SRC_JS = [ SRC, 'js' ].join('/');
var SRC_JS_LIB = [ SRC_JS, 'lib' ].join('/');
var SRC_JADE = [ SRC, 'jade' ].join('/');
var SRC_JADE_HELPER = [ SRC_JADE, 'helper' ].join('/');
var SRC_DATA = [ SRC, 'data' ].join('/');

var GLOB_SASS = path.join(SRC_SASS, '**/*.scss');
var GLOB_JS = path.join(SRC_JS, '**/*.js');
var GLOB_JADE = path.join(SRC_JADE, '**/*.jade');
var GLOB_DATA = path.join(SRC_DATA, '*');

var DEST = '../public';
var DEST_IMG = path.join(DEST, 'img');
var DEST_CSS = path.join(DEST, 'css');
var DEST_JS = path.join(DEST, 'js');
var DEST_JS_LIB = path.join(DEST_JS, 'lib');
var DEST_HTML = DEST;

var HTTP_PATH = '/';

var onError = notify.onError({
    title: 'Error: <%= error.plugin %> / ' + PROJ_NAME,
    message: '<%= error.message %>'
});

var loadLocals = function () {
    var locals = util.readConfig([
        'config/meta.yaml',
        {
            http_path: HTTP_PATH
        }
    ]);
    return locals;
};


/* ========================================= *
 * tasks
 * ========================================= */

// css
gulp.task('sass', function () {
    return sass(SRC_SASS, { style: 'compressed' })
        .pipe(pleeease())
        .on('error', onError)
        .pipe(gulp.dest(DEST_CSS));
});

gulp.task('css', ['sass']);


// js
gulp.task('copy-lib', function () {
    return gulp.src([
        'bower_components/html5shiv/dist/html5shiv.min.js'
    ]).pipe(gulp.dest(DEST_JS_LIB));
});

gulp.task('compile-js', function () {

    gulp.src(SRC_JS + '/hinagataGulp*.js')
        .pipe(varline({
            wrap: true,
            loadPath: [
                SRC_JS + '/*.js',
                SRC_JS_LIB + '/*.js'
            ],
            alias: {
                $: 'jquery',
                _: 'underscore'
            }
        }))
        .on('error', onError)
        .pipe(gulp.dest(DEST_JS));
});

gulp.task('js', ['copy-lib', 'compile-js']);


// html
gulp.task('jade', function () {
    var locals = loadLocals();
    locals.SNSHelper = require(SRC_JADE_HELPER + '/SNSHelper');

    gulp.src(SRC_JADE + '/*.jade')
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        .on('error', onError)
        .pipe(gulp.dest(DEST_HTML));
});

gulp.task('html', ['jade']);


// server
gulp.task('server', function () {
    new Koko(path.resolve(DEST), {
        openPath: HTTP_PATH
    }).start();
});


// publish
gulp.task('publish', function () {
    var config = util.readConfig([ 'config/aws-credentials.json' ]);
    
    var publisher = awspublish.create(config);
    gulp.src(DEST + '/**/*')
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));
});


// optimize-image
gulp.task('optimize-image', function (callback) {
    var exec = require('child_process').exec;

    var cmd = [
        'cd ' + DEST_IMG,
        'pngquant 256 --ext=.png -f *.png',
        'open -a /Applications/ImageOptim.app *.png'
    ].join(' && ');
    
    exec(cmd, function (error, stdout, stderr) {
        callback(error);
    });
});


// watch
gulp.task('watch', function () {
    gulp.watch(GLOB_SASS, ['sass']);
    gulp.watch(GLOB_JS, ['js']);
    gulp.watch(GLOB_JADE, ['jade']);
    gulp.watch(GLOB_DATA, ['html']);
});


// default
gulp.task('default', ['css', 'js', 'html']);
