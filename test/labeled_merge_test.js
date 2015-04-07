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

// list of initial test files with hashes
var files = {
    '.subdir2/file6': 'b15c153fbd09837316aae99af8f8feed',
    'file1': '68dc8cd1b345080db413b266ee2e44a0',
    'file2.txt': '6563acbb57e7d340e5ac4fd33b161df4',
    'subdir/.file3.cfg': 'ee5ae220bbb21fbbb7724141498dd9ab',
    'subdir/file5': 'c6b0c67ea05214aed0ee2b8c8a9b469d',
    'subdir/subsubdir/file4': '37e3e3d1f2bdbcf098f8d75532531d5d'
};

// initial files.json
var filesJson_initial = {
    '.subdir2/file6': {
        'b15c153fbd09837316aae99af8f8feed': ['default_options_initial']
    },
    'file1': {
        '68dc8cd1b345080db413b266ee2e44a0': ['default_options_initial'],
    },
    'file2.txt': {
        '6563acbb57e7d340e5ac4fd33b161df4': ['default_options_initial'],
    },
    'subdir/.file3.cfg': {
        'ee5ae220bbb21fbbb7724141498dd9ab': ['default_options_initial'],
    },
    'subdir/file5': {
        'c6b0c67ea05214aed0ee2b8c8a9b469d': ['default_options_initial'],
    },
    'subdir/subsubdir/file4': {
        '37e3e3d1f2bdbcf098f8d75532531d5d': ['default_options_initial']
    }
};

exports.labeled_merge = {

    default_options_initial: function(test) {
        var destDir = 'tmp/default_options_initial';

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
            filesJson_initial,
            'files.json has wrong content'
        );

        // test added files
        Object.keys(files).forEach(function testFileExistence(testFile) {
            test.equal(
                grunt.file.isFile(join(destDir, testFile)),
                true,
                testFile + ' was not created'
            );
        });

        test.done();
    }
};
