var path = require('path');

var gulp = require('gulp');
var through = require('through2');
var gutil = require('gulp-util');
var frontMatter = require('gulp-front-matter');

var PLUGIN_NAME = 'gulp-jade-postman';

module.exports = function (opts) {
    opts = opts || {};

    var posts = opts.posts;
    var layout = opts.layout;
    var block = opts.block;

    var locals = opts.locals || {};
    var markdownFilter = opts.markdownFilter || 'marked';
    var property = opts.property || 'frontMatter';


    if (!layout) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'no layout'));
    }
    if (!block) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'no block'));
    }

    function transform(file, encoding, callback) {
        // TODO: tocが必要な場合は、すべて作ってからpushする必要がありそう
        file.data = locals;
        this.push(file);
        
        return callback();
    }

    function flush(callback) {
        var postman = this;
        
        gulp.src(posts)
            .pipe(frontMatter({
                property: property,
                remove: true
            }))
            .pipe(through.obj(function (file, encode, callback) {
                var jade = [
                    'extends ' + layout,
                    'block ' + block,
                    '  include:' + markdownFilter + ' ' + path.relative(file.cwd, file.path)
                ].join('\n');

                var post = new gutil.File({
                    cwd: '.',
                    base: '.',
                    path: path.basename(file.path).replace(/\.md$/, '.jade')
                });
                post.contents = new Buffer(jade);
                post.data = locals;
                post.data[property] = file[property];
                postman.push(post);
                
                callback();
            }))
            .on('end', callback);
    }

    return through.obj(transform, flush);
};
