var path = require('path');

var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');
var frontMatter = require('gulp-front-matter');
var marked = require('marked');

var PLUGIN_NAME = 'gulp-postman';

module.exports = function (opts) {
    opts = opts || {};

    var posts = opts.posts;
    var template = opts.template;

    var locals = opts.locals || {};
    var base = opts.base || '.';
    var metaProperty = opts.metaProperty || 'meta';
    var bodyProperty = opts.bodyProperty || 'body';
    var frontMatterProperty = opts.frontMatterProperty || 'frontMatter';
    var archiveProperty = opts.archiveProperty || 'archive';
    var markedOpts = opts.markedOpts || {
        breaks: true
    };

    var files = [];

    function transformName(template, postName) {
        return path.resolve(path.join(
            path.dirname(template),
            path.basename(postName, '.md') + path.extname(template)
        ));
    }

    if (!template) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'no template'));
    }

    var templateSource = require('fs').readFileSync(template, 'utf8');

    function transform(file, encoding, callback) {
        // postの元になるテンプレートは、そのままでは使用しない
        if(!path.relative(template, file.path)) {
            return callback();
        }
        
        file.data = locals;
        files.push(file);
        
        return callback();
    }

    function flush(callback) {
        var postman = this;

        var archive = [];
        
        gulp.src(posts)
            .pipe(frontMatter({
                property: frontMatterProperty,
                remove: true
            }))
            .pipe(through.obj(function (file, encode, callback) {
                var post = new gutil.File({
                    cwd: '.',
                    base: base,
                    path: transformName(template, file.path)
                });

                var meta = file[frontMatterProperty];
                meta.slug = path.basename(post.basename, path.extname(post.basename));
                
                post.contents = new Buffer(templateSource);
                post.data = locals;
                post.data[metaProperty] = meta;
                post.data[bodyProperty] = marked(file.contents.toString(), markedOpts);
                files.push(post);
                
                archive.push(meta);
                
                callback();
            }, function (callback) {
                files.forEach(function (file) {
                    file.data[archiveProperty] = archive;
                    postman.push(file);
                }.bind(this));
                callback();
            }))
            .on('end', callback);
    }

    return through.obj(transform, flush);
};
