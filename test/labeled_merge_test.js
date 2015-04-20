'use strict';

var grunt = require('grunt'),
    join = require('path').join,
    mergeMeta = require('tasks/lib/merge-meta'),
    fakeHasher = require('test/stubs/file-hash');

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
                    'test/fixtures/metas/first.json'));
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
        Object.keys(files).forEach(function testFileExistence(testFile) {
            test.equal(
                grunt.file.isFile(join(destDir, testFile)),
                true,
                testFile + ' was not created'
            );
        });
        test.done();
    },

    secondRun: function(test) {
        var destDir = 'tmp/default_options_first',
            filesJson_second = grunt.file.readJSON(
                'test/fixtures/metas/second.json'));
test.deepEqual(
    grunt.file.readJSON(join(destDir, '.meta/files.json')),
    filesJson_second,
    'files.json has wrong content'
);
// test added and renamed files
test.equal(
    grunt.file.isFile(join(destDir, 'subdir', 'file7')),
    true,
    'subdir/file7 was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'subdir', 'file5.c6b0c67e')),
    true,
    'subdir/file5.c6b0c67e was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'subdir', 'file5.c6b0c67e')),
    true,
    'subdir/file5.32db936c was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'file2.6563acbb.txt')),
    true,
    'file2.6563acbb.txt was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'file2.488fca17.txt')),
    true,
    'file2.488fca17.txt was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'subdir', '.file3.ee5ae220.cfg')),
    true,
    'subdir/file3.ee5ae220.cfg was not created'
);
test.equal(
    grunt.file.isFile(join(destDir, 'subdir', '.file3.f40a3f71.cfg')),
    true,
    'subdir/file3.f40a3f71.cfg was not created'
);
test.done();
}
};

exports.failureDir = {

    setUp: function(callback) {
        grunt.file.mkdir('tmp/targetSource');
        callback();
    },

    tearDown: function(callback) {
        grunt.file.delete('tmp/targetSource');
        callback();
    },

    failDir: function(test) {
        test.throws(
            function wrongDest() {
                mergeMeta('test/fixtures/first/file1', 'test/fixtures/second');
            },
            'merge-meta did not throw on invalid destination'
        );

        test.throws(
            function noExistsDest() {
                mergeMeta('this/folder/does/not/exist', 'test/fixtures/second');
            },
            'merge-meta did not throw on inexistent destination'
        );

        test.throws(
            function wrongSource() {
                mergeMeta('tmp/targetSource', 'test/fixtures/first/file1');
            },
            'merge-meta did not throw on invalid source'
        );

        test.throws(
            function noExistsSource() {
                mergeMeta('tmp/targetSource', 'this/folder/does/not/exist');
            },
            'merge-meta did not throw on inexistent source'
        );
    }

};

exports.failureHash = {

    setUp: function(callback) {
        grunt.file.copy('test/fixtures/first/file1', 'tmp/targetSource');
        grunt.file.copy('test/fixtures/first/file1', 'tmp/targetDest');
        callback();
    },

    tearDown: function(callback) {
        grunt.file.delete('tmp/targetSource');
        grunt.file.delete('tmp/targetDest');
        callback();
    },

    failHash: function(test) {
        // fakeHasher returns an incremental hash, so if merge-label isn't
        // capable to create a proper filename it should blow up.
        test.throws(
            function wrongHash() {
                mergeMeta('tmp/targetSource', 'tmp/targetDest', {
                    doHash: fakeHasher
                });
            },
            'merge-meta did not throw on invalid hash'
        );
    }
};

