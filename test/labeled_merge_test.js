'use strict';

var grunt = require('grunt'),
    join = require('path').join;

/*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
        test.expect(numAssertions)
        test.done()
    Test assertions:
        test.ok(value, [message])
        test.equal(actual, expected, [message])
        test.notEqual(actual, expected, [message])
        test.deepEqual(actual, expected, [message])
        test.notDeepEqual(actual, expected, [message])
        test.strictEqual(actual, expected, [message])
        test.notStrictEqual(actual, expected, [message])
        test.throws(block, [error], [message])
        test.doesNotThrow(block, [error], [message])
        test.ifError(value)
*/

exports.default_options = {

    firstRun: function(test) {
        var destDir = 'tmp/default_options_initial',
            filesJson_first = grunt.file.readJSON(
                'test/fixtures/metas/first.json'),
            filesName_first = grunt.file.readJSON(
                'test/fixtures/metas/firstFiles.json');
        // test meta files
        test.equal(
            grunt.file.isDir(join(destDir, '.meta')),
            true,
            'Meta dir was not created'
        );
        test.equal(
            grunt.file.isFile(join(destDir, '.meta/files.json')),
            true,
            'files.json was not created'
        );
        test.deepEqual(
            grunt.file.readJSON(join(destDir, '.meta/files.json')),
            filesJson_first,
            'files.json has wrong content'
        );
        // test added files
        filesName_first.forEach(function testFileExistence(testFile) {
            test.equal(
                grunt.file.isFile(join(destDir, testFile)),
                true,
                testFile + ' was not created'
            );
        });
        test.expect(3 + filesName_first.length);
        test.done();
    },

    secondRun: function(test) {
        var destDir = 'tmp/default_options_two_pass',
            filesJson_second = grunt.file.readJSON(
                'test/fixtures/metas/second.json'),
            filesName_second = grunt.file.readJSON(
                'test/fixtures/metas/secondFiles.json');
        test.deepEqual(
            grunt.file.readJSON(join(destDir, '.meta/files.json')),
            filesJson_second,
            'files.json has wrong content'
        );
        // test added files
        filesName_second.forEach(function testFileExistence(testFile) {
            test.equal(
                grunt.file.isFile(join(destDir, testFile)),
                true,
                testFile + ' was not created'
            );
        });
        test.expect(1 + filesName_second.length);
        test.done();
    }
};
