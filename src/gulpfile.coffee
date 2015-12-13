gulp = require 'gulp'
sass = require 'gulp-ruby-sass'
pleeease = require 'gulp-pleeease'
varline = require('varline').gulp
jade = require 'gulp-jade'
Koko = require 'koko'
awspublish = require 'gulp-awspublish'
rename = require 'gulp-rename'
notify = require 'gulp-notify'
jadePostman = require './lib/jadePostman'

util = require './lib/task-util'


# ========================================= #
# const
# ========================================= #
PROJ_NAME = 'hinagata-gulp'

SRC = '.'
SRC_SCSS = "#{SRC}/scss"
SRC_JS = "#{SRC}/js"
SRC_JS_LIB = "#{SRC_JS}/lib"
SRC_JADE = "#{SRC}/jade"
SRC_JADE_HELPER = "#{SRC_JADE}/helper"
SRC_CONFIG = "#{SRC}/config"

GLOB_SCSS = "#{SRC_SCSS}/**/*.scss"
GLOB_JS = "#{SRC_JS}/**/*.js"
GLOB_JADE = "#{SRC_JADE}/**/*.jade"
GLOB_CONFIG = "#{SRC_CONFIG}/*"

DEST = '../public'
DEST_IMG = "#{DEST}/img"
DEST_CSS = "#{DEST}/css"
DEST_JS = "#{DEST}/js"
DEST_JS_LIB = "#{DEST_JS}/lib"
DEST_HTML = DEST

HTTP_PATH = '/'

onError = notify.onError
    title: "Error: <%= error.plugin %> / #{PROJ_NAME}"
    message: '<%= error.message %>'

# ========================================= #
# tasks
# ========================================= #

# css
gulp.task 'sass', ->
    sass(SRC_SCSS, { style: 'compressed' })
        .pipe(pleeease())
        .on('error', onError)
        .pipe(gulp.dest(DEST_CSS))

gulp.task 'css', ['sass']


# js
gulp.task 'copy-lib', ->
    config = util.readConfig "#{SRC_CONFIG}/copy.yaml"
    gulp.src(config.js_lib).pipe(gulp.dest(DEST_JS_LIB))

gulp.task 'varline', ->
    gulp.src("#{SRC_JS}/hinagataGulp*.js")
        .pipe(varline(util.readConfig([
            "#{SRC_CONFIG}/varline.yaml",
            {
                loadPath: [
                    "#{SRC_JS}/*.js",
                    "#{SRC_JS_LIB}/*.js"
                ]
            }
        ])))
        .on('error', onError)
        .pipe(gulp.dest(DEST_JS))

gulp.task 'js', ['copy-lib', 'varline']


# html
gulp.task 'jade', ->
    locals = util.readConfig([
        "#{SRC_CONFIG}/meta.yaml",
        {
            http_path: HTTP_PATH,
            SNSHelper: require("#{SRC_JADE_HELPER}/SNSHelper")
        }
    ])

    gulp.src("#{SRC_JADE}/*.jade")
        .pipe(jadePostman({
            locals: locals
            posts: "../posts/*.md"
            layout: "#{SRC_JADE}/layout/PostLayout"
            block: "PostBlock"
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename(util.renameDotSlash))
        .on('error', onError)
        .pipe(gulp.dest(DEST_HTML))

gulp.task 'html', ['jade']


# server
gulp.task 'server', ->
    new Koko(DEST, {
        openPath: HTTP_PATH
    }).start()


# publish
gulp.task 'publish', ->
    config = util.readConfig([
        "#{SRC_CONFIG}/aws-credentials.json"
    ])
    
    publisher = awspublish.create(config)
    gulp.src("#{DEST}/**/*")
        .pipe(publisher.publish())
        .pipe(publisher.sync())
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }))


# optimize-image
gulp.task 'optimize-image', (callback) ->
    exec = require('child_process').exec

    cmd = [
        "cd #{DEST_IMG}",
        "pngquant 256 --ext=.png -f *.png",
        "open -a /Applications/ImageOptim.app *.png"
    ].join(' && ')
    
    exec cmd, (error, stdout, stderr) ->
      callback(error)
        

# watch
gulp.task 'watch', ->
    gulp.watch(GLOB_SCSS, ['sass'])
    gulp.watch(GLOB_JS, ['js'])
    gulp.watch(GLOB_JADE, ['jade'])
    gulp.watch(GLOB_CONFIG, ['html'])


# default
gulp.task 'default', ['css', 'js', 'html']
