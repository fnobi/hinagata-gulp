var path = require('path');
var fs = require('fs');

var jade = require('jade');

var JADE_SRC = [
    'doctype html',
    'html',
    '  head',
    '    meta(charset="utf-8")',
    '    title mocha test',
    '  body',
    '    #mocha',
    '    script(src=mochaPath)',
    '    script!= setupCode',
    '    if assertPath',
    '      script(src=assertPath)',
    '    script!= testCode',
    '    if useCheckLeaks',
    '      script.',
    '        mocha.checkLeaks();',
    '    script.',
    '      mocha.run();'
].join('\n');

var TmpTestHtml = function (opts) {
    opts = opts || {};

    this.dest = opts.dest || 'test.html';
    this.mochaPath = opts.mochaPath || 'node_modules/mocha/mocha.js';
    this.assertPath = opts.assertPath;
    this.testType = opts.testType || 'bdd';
    this.useCheckLeaks = !!opts.useCheckLeaks;
    this.testScriptPath = opts.testScriptPath;

    this.writeFile();
};

TmpTestHtml.prototype.writeFile = function () {
    var dest = this.dest;
    
    var testCode = '';
    if (this.testScriptPath) {
        testCode = fs.readFileSync(this.testScriptPath, 'utf8');
    }

    var mochaPath = path.relative(path.dirname(dest), this.mochaPath);
    var assertPath = this.assertPath
            ? path.relative(path.dirname(dest), this.assertPath)
            : '';
    
    var fn = jade.compile(JADE_SRC);
    fs.writeFileSync(dest, fn({
        testCode: testCode,
        setupCode: 'mocha.setup("' + this.testType + '")',
        mochaPath: mochaPath,
        assertPath: assertPath,
        useCheckLeaks: this.useCheckLeaks
    }));
};

module.exports = TmpTestHtml;
