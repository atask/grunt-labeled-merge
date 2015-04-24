var grunt = require('grunt'),
    Promise = require('core-js/library/es6/promise'),
    glob = require('glob'),
    getFileHash = require('./file-hash'),
    getDirLabel = require('./dir-label'),
    hashPath = require('./hash-path'),
    join = require('path').join;

var META_DIR = '.meta',
    LIST_FILE = 'files.json';
    
module.exports = {
    merge: function(dest, src, options) {
        'use strict';

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

        return new Promise( function mergePromise(resolve, reject) {
            // verify that dest and src are folders
            if (grunt.file.exists(dest)) {
                if (!grunt.file.isDir(dest)) {
                    reject(new Error('Invalid dest folder'));
                }
            }
            if (!grunt.file.isDir(src)) {
                reject(new Error('Invalid src folder'));
            }

            // get folder label
            label = getLabel(src);
            if (typeof label !== 'string') {
                reject(new Error('Invalid label'));
            }

            // right now there is no support for merging folders
            // with meta info
            if (grunt.file.isDir(srcMeta)) {
                reject(new Error('Meta folder in ' + src));
            }

            // test if meta is available
            if (grunt.file.exists(destMeta)) {
                meta = grunt.file.readJSON(destMeta);
            } else {
                grunt.file.mkdir(join(dest, META_DIR));
            }

            // label must not already have been added
            if (meta.labels.indexOf(label) !== -1) {
                reject(new Error('Label already indexed'));
            }

            // get file list
            files = glob.sync('**', {
                cwd: src,
                dot: true,
                nodir: true
            }).map(function getStats(relPath) {
                return {
                    relSrc: relPath,
                    src: join(src, relPath)
                };
            });

            resolve();
        })

        .then( function addHashInfo() {
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
            // right now, folders that don't provide new files
            // are not welcome
            if (!toCopy.length) {
                reject(new Error('No new files from ' + src));
            }

            // if combining hash in file name unluckily collides with
            // another file, give up
            toCopy.forEach(function testExists(file) {
                if (grunt.file.exists(file.dest)) {
                    reject(new Error('Generated file already exists: ' + file.dest));
                }
            });
        })

        .then( function writeMerge() {
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
