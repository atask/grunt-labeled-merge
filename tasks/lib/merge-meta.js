var grunt = require('grunt'),
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

            var getHash = options.getHash || getFileHash,
                getLabel = options.getLabel || getDirLabel,
                getFileId = options.getFileIf || hashPath;

            // verify that dest and src are folders
            if (!grunt.file.isDir(dest)) {
                throw new Error('Invalid dest folder');
            }
            if (!grunt.file.isDir(src)) {
                throw new Error('Invalid src folder');
            }

            // get folder label
            var label = getLabel(src);
            if (typeof label !== 'string') {
                throw new Error('Invalid label');
            }

            // right now there is no support for merging folders
            // with meta info
            var srcMeta = join(src, META_DIR, LIST_FILE);
            if (grunt.file.isDir(srcMeta)) {
                throw new Error('Meta folder in ' + src);
            }

            // test if meta is available
            var destMeta = join(dest, META_DIR, LIST_FILE);
            var files = {};
            if (grunt.file.isDir(destMeta)) {
                files = grunt.file.readJSON(destMeta);
            } else {
                grunt.file.mkdir(join(dest, META_DIR));
            }

            // label must not already have been added
            if (files.labels.indexOf(label) !== -1) {
                throw new Error('Label already indexed');
            }

            // get file list
            var srcFiles = glob.sync('**', {
                cwd: src,
                dot: true,
                nodir: true
            });

            // add files to meta index, marking them for copy when needed
            var toCopy = [];
            files.labels.push(label);
            srcFiles.forEach(function addFile(relPath) {
                var absPath = join(src, relPath);
                getHash.then(function evalHash(hash) {
                    if (relPath in files) {
                        var hashMap = files[relPath];
                        if (hash in hashMap) {
                            // file with same hash already indexed, adding
                            // label to list
                            hashMap[hash].push(label);
                        } else {
                            // a new version of the file, add file and
                            // update hash list
                            hashMap[hash] = [label];
                            toCopy.push({
                                src: absPath,
                                dest: getFileId(absPath, hash)
                            });
                        }
                    } else {
                        // file never indexed, add file and update
                        // hash list
                        files[relPath] = {};
                        files[relPath][hash] = [label];
                        toCopy.push({
                            src: absPath,
                            dest: getFileId(absPath, hash)
                        });
                    }
                });
            });

            // right now, folders that don't provide new files
            // are not welcome
            if (!toCopy.length) {
                throw new Error('No new files from ' + src);
            }

            // if combining hash in file name unluckily collides with
            // another file, give up
            toCopy.forEach(function testExists(absPath) {
                if (grunt.file.exists(absPath)) {
                    throw new Error('Generated file already exists: ' + absPath);
                }
            });

            // if we reached here, everything is ready for merge
            
            // save meta file
            grunt.file.write(destMeta, JSON.stringify(files));
            
            // copy new files
            toCopy.forEach(function copyFile(mapping) {
                grunt.file.copy(mapping.src, mapping.dest);
            });
        }
    };
