var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect,
    should = chai.should(),
    grunt = require('grunt'),
    join = require('path').join,
    mergeMetaPath = join('..', process.env.MERGE_META_DIR, 'tasks/lib/merge-meta'),
    mergeMeta = require(mergeMetaPath);

describe('labeled-merge', function() {
    describe('dir failures', function() {
        beforeEach('create a faux src dir', function() {
            grunt.file.mkdir('tmp/targetSource');
        });

        afterEach('remove fake dir', function() {
            grunt.file.delete('tmp/targetSource');
        });

        it('has to fail on invalid destination', function() {
            mergeMeta.merge('test/fixtures/first/file1', 'test/fixtures/second')
                .should.eventually.be.rejected;
        });

        it('has to fail on inexistent destination', function() {
            mergeMeta.merge('this/folder/does/not/exist', 'test/fixtures/second')
                .should.eventually.be.rejected;
        });

        it('has to fail on invalid source', function() {
            mergeMeta.merge('tmp/targetSource', 'test/fixtures/first/file1')
                .should.eventually.be.rejected;
        });

        it('has to fail on inexistent source', function() {
            mergeMeta.merge('tmp/targetSource', 'this/folder/does/not/exist')
                .should.eventually.be.rejected;
        });

    });
});
