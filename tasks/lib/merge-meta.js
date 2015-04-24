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

        var label;
        var files = [];
        var meta = {
            labels: [],
            files: {}
        };
        var toCopy = [];

        return new Promise( function mergePromise(resolve, reject) {
            var getHash = options && options.getHash || getFileHash,
                getLabel = options && options.getLabel || getDirLabel,
                getFileId = options && options.getFileId || hashPath;

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
            var srcMeta = join(src, META_DIR);
            if (grunt.file.isDir(srcMeta)) {
                reject(new Error('Meta folder in ' + src));
            }

            // test if meta is available
            var destMeta = join(dest, META_DIR, LIST_FILE);
            if (grunt.file.exists(destMeta)) {
                meta = grunt.file.readJSON(destMeta);
            } else {
                grunt.file.mkdir(join(dest, META_DIR));
            }

            // label must not already have been added
            if (files.labels.indexOf(label) !== -1) {
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

            resolve():
        })

        .then( function addHashInfo() {
            return Promise.all(
                files.map( function doHash(file) {
                    return getHash(file.src);
                })
            ).then( function(hashList) {
                files.forEach( function(file, index) {
                    file.hash = hashList[index];
                    file.dest = getFileId(file.src, hash);
                });
            });
        })

        .then( function evaluateFiles() {
            // add files to meta index, marking them for copy when needed
            files.forEach( function (file) {
                if (file.relSrc in meta.files) {
                    var hashMap = meta.files[relPath];
                    if (hash in hashMap) {
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
                        files[file.relSrc][file.hash] = [label];
                        toCopy.push(file);
                    }
                });
            })
// TODO: RESTART FROM HERE!
                });
            });

            // right now, folders that don't provide new files
            // are not welcome
            if (!toCopy.length) {
                reject(new Error('No new files from ' + src));
            }

            // if combining hash in file name unluckily collides with
            // another file, give up
            toCopy.forEach(function testExists(absPath) {
                if (grunt.file.exists(absPath)) {
                    reject(new Error('Generated file already exists: ' + absPath));
                }
            });

            // if we reached here, everything is ready for merge
            
            // save meta file
            files.labels.push(label);
            grunt.file.write(destMeta, JSON.stringify(files));
            
            // copy new files
            toCopy.forEach(function copyFile(mapping) {
                grunt.file.copy(mapping.src, mapping.dest);
            });

        resolve();
        });
    }
};
