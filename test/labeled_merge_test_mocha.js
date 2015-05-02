'use strict';
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);

var grunt = require('grunt'),
    join = require('path').join,
    mergeMetaPath = join('..', process.env.MERGE_META_DIR, 'tasks/lib/merge-meta'),
    mergeMeta = require(mergeMetaPath),
    fakeHasher = require('./stubs/file-hash');

describe('labeled-merge', function() {
    describe('dir failures', function() {
        beforeEach('create a faux src dir', function() {
            grunt.file.mkdir('tmp/targetDest');
        });

        afterEach('remove fake dir', function() {
console.log('after each dir');
            grunt.file.delete('tmp/targetDest');
        });

        it('has to fail on invalid destination', function() {
            mergeMeta
                .merge('test/fixtures/first/file1', 'test/fixtures/second')
                .should.eventually.be.rejectedWith(Error);
        });

        it('has to fail on inexistent destination', function() {
            mergeMeta
                .merge('this/folder/does/not/exist', 'test/fixtures/second')
                .should.eventually.be.rejectedWith(Error);
        });

        it('has to fail on invalid source', function() {
            mergeMeta
                .merge('tmp/targetDest', 'test/fixtures/first/file1')
                .should.eventually.be.rejectedWith(Error);
        });

        it('has to fail on inexistent source', function() {
            mergeMeta
                .merge('tmp/targetDest', 'this/folder/does/not/exist')
                .should.eventually.be.rejectedWith(Error);
        });
    });

    describe('hash failures', function() {
        beforeEach('create two faux src dirs', function() {
            grunt.file.copy(
                'test/fixtures/first/file1',
                'tmp/failHashSrc1'
            );
            grunt.file.copy(
                'test/fixtures/first/file1',
                'tmp/failHashSrc2'
            );
        });

        afterEach('remove fake dirs', function() {
console.log('after each hash');
            grunt.file.delete('tmp/failHashSrc1');
            grunt.file.delete('tmp/failHashSrc2');
//            grunt.file.delete('tmp/targetDest');
        });

        it('has to fail on hash collision', function() {
            mergeMeta
                .merge('tmp/targetDest', 'tmp/failHashSrc1', {
                    getHash: fakeHasher
                })
                .then( function secondPass() {
console.log('HERE');
/*
                    return mergeMeta
                        .merge('tmp/targetDest', 'tmp/failHashSrc2', {
                            getHash: fakeHasher
                        });
/*                })
                .should.eventually.be.rejectedWith(Error);
        });
    });
});
