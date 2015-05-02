var grunt = require('grunt'),
    Promise = require('core-js/library/es6/promise'),
    debug = require('debug')('merge-meta'),
    glob = require('glob'),
    getFileHash = require('./file-hash'),
    getDirLabel = require('./dir-label'),
    hashPath = require('./hash-path'),
    join = require('path').join,
    eol = require('os').EOL;

var META_DIR = '.meta',
    LIST_FILE = 'files.json';

var LIST_IGNORE = ['.ds_store'];
    
module.exports = {
    merge: function(dest, src, options) {
        'use strict';

        debug(
            '- init' + eol +
            '\t' + 'src: [' + src + ']' + eol +
            '\t' + 'dest: [' + dest + ']'
        );

        var getHash = options && options.getHash || getFileHash,
            getLabel = options && options.getLabel || getDirLabel,
            getFileId = options && options.getFileId || hashPath;

        var destMeta = join(dest, META_DIR, LIST_FILE);
        var srcMeta = join(src, META_DIR);

        var label;
        var files = [];
        var meta = {
            labels: [],
            files: {}
        };
        var toCopy = [];

        return new Promise( function mergePromise(resolve) {

            debug(
                '- preconditions' + eol +
                '\t' + 'src: [' + src + ']' + eol +
                '\t' + 'dest: [' + dest + ']'
            );

            // verify that dest and src are folders
            if (grunt.file.exists(dest)) {
                if (!grunt.file.isDir(dest)) {
                    throw new Error('Invalid dest folder');
                }
            }
            if (!grunt.file.isDir(src)) {
                throw new Error('Invalid src folder');
            }

            // get folder label
            label = getLabel(src);
            if (typeof label !== 'string') {
                throw new Error('Invalid label');
            }

            // right now there is no support for merging folders
            // with meta info
            if (grunt.file.isDir(srcMeta)) {
                throw new Error('Meta folder in ' + src);
            }

            // test if meta is available
            if (grunt.file.exists(destMeta)) {
                meta = grunt.file.readJSON(destMeta);
            } else {
                grunt.file.mkdir(join(dest, META_DIR));
            }

            // label must not already have been added
            if (meta.labels.indexOf(label) !== -1) {
                throw new Error('Label already indexed');
            }

            // get file list
            files = glob.sync('**', {
                cwd: src,
                dot: true,
                nodir: true
            }).filter(function removeIgnored(relPath) {
                // ignore system files
                var match = LIST_IGNORE
                    .some(function searchIgnoredFile(ignored) {
                        return relPath
                            .toLowerCase()
                            .indexOf(ignored.toLowerCase()) !== -1;
                    });
                return !match;
            }).map(function getStats(relPath) {
                return {
                    relSrc: relPath,
                    src: join(src, relPath)
                };
            });

            resolve();
        })

        .then( function addHashInfo() {

            debug(
                '- addHashInfo' + eol +
                '\t' + 'src: [' + src + ']' + eol +
                '\t' + 'dest: [' + dest + ']'
            );

            return Promise.all(
                files.map( function doHash(file) {
                    return getHash(file.src);
                })
            ).then( function(hashList) {
                files.forEach( function(file, index) {
                    var hash = hashList[index];
                    file.hash = hash;
                    file.dest = join(dest, getFileId(file.relSrc, hash));
                });
            });
        })

        .then( function evaluateFiles() {

            debug(
                '- evaluateFiles' + eol +
                '\t' + 'src: [' + src + ']' + eol +
                '\t' + 'dest: [' + dest + ']'
            );

            // add files to meta index, marking them for copy when needed
            files.forEach( function (file) {
                if (file.relSrc in meta.files) {
                    var hashMap = meta.files[file.relSrc];
                    if (file.hash in hashMap) {
                        // file with same hash already indexed, adding
                        // label to list
                        hashMap[file.hash].push(label);
                    } else {
                        // a new version of the file, add file and
                        // update hash list
                        hashMap[file.hash] = [label];
                        toCopy.push(file);
                    }
                } else {
                    // file never indexed, add file and update
                    // hash list
                    meta.files[file.relSrc] = {};
                    meta.files[file.relSrc][file.hash] = [label];
                    toCopy.push(file);
                }
            });
        })

        .then( function() {

            debug(
                '- postconditions' + eol +
                '\t' + 'src: [' + src + ']' + eol +
                '\t' + 'dest: [' + dest + ']'
            );

            // right now, folders that don't provide new files
            // are not welcome
            if (!toCopy.length) {
                throw new Error('No new files from ' + src);
            }

            // if combining hash in file name unluckily collides with
            // another file, give up
            toCopy.forEach(function testExists(file) {
                if (grunt.file.exists(file.dest)) {
                    throw new Error('Generated file already exists: ' + file.dest);
                }
            });
        })

        .then( function writeMerge() {

            debug(
                '- writeMerge' + eol +
                '\t' + 'src: [' + src + ']' + eol +
                '\t' + 'dest: [' + dest + ']'
            );

            // if we reached here, everything is ready for merging
            
            // save meta file
            meta.labels.push(label);
            grunt.file.write(destMeta, JSON.stringify(meta));
            
            // copy new files
            toCopy.forEach(function copyFile(mapping) {
                grunt.file.copy(mapping.src, mapping.dest);
            });

        });
    }
};
