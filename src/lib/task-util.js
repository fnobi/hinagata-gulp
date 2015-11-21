var fs = require('fs');
var yaml = require('js-yaml');

module.exports = {
    readConfig: function (configs) {
        configs = configs || [];
        if (!configs.forEach) {
            configs = [configs];
        }

        var result = {};
        configs.forEach(function (conf) {
            var obj = {};
            if (typeof conf == 'string') {
                if (/\.yaml$/.test(conf)) {
                    obj = this.readYAML(conf);
                } else if (/\.json$/.test(conf)) {
                    obj = this.readJSON(conf);
                } else if (/\.js$/.test(conf)) {
                    obj = require(conf);
                }
            } else if (typeof conf == 'object') {
                obj = conf;
            }

            for (var key in obj) {
                result[key] = obj[key];
            }
        }.bind(this));
        return result;
    },
    readYAML: function (src) {
        var obj = null;
        try {
            obj = yaml.safeLoad(this.readFile(src));
        } catch (e) { /* do nothing */ }
        return obj;
    },
    readJSON: function (src) {
        var obj = null;
        try {
            obj = JSON.parse(this.readFile(src));
        } catch (e) { /* do nothing */ }
        return obj;
    },
    readFile: function (src) {
        return fs.readFileSync(src, 'utf8');
    },
    renameDotSlash: function (path) {
        if (/\./.test(path.basename)) {
            var parts = path.basename.split(/\./);
            path.basename = parts.pop();
            path.dirname += '/' + parts.join('/');
        }
    }
};







