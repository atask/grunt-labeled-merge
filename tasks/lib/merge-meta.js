var fileHash = require('./file-hash'),
    join = require('path').join,
    Promise = require('core-js/library/es6/promise');

module.exports = function(grunt) {

    var META_DIR = '.meta',
        LABEL_FILE = 'labels.json',
        CLASH_FILE = 'clashes.json';
    
    function hasMeta(dir) {
            var meta = grunt.file.isDir(dir, META_DIR),
                labels = grunt.file.isFile(dir, META_DIR, LABEL_FILE),
                clashes = grunt.file.isFile(dir, META_DIR, CLASH_FILE);
            return (meta && labels && clashes);
        }

    function labelFile(filename, label) {
        var dotPos = filename.lastIndexOf('.');
        if (dotPos !== -1 && dotPos !== 0) {
            // file has extension
            var newFilename = filename.substring(0, dotPos) + 
                '.' + label + filename.substring(dotPos, filename.length);
            destTestPath = destTestPath.replace(filename, newFilename);
        } else {
            // no extension
            destTestPath += '.' + label;
        }
    }

    return {
        create: function create(dir, labelFunc, renameFunc, copyFunc) {

            var labels = [],
                clashes = {},
                fileLists = {},
                destRootdir = dir,
                labelDir = labelFunc,
                queueFileRename = renameFunc,
                queueFileCopy = copyFunc,
                hasMeta = hasMeta(dir);

            if (hasMeta) {
                labels = grunt.file.readJSON(destRootdir, META_DIR, LABEL_FILE);
                clashes = grunt.file.reaJSON(destRootdir, META_DIR, CLASH_FILE);
            }

            return {
                addFile: function addFile(srcAbspath, srcRootdir, srcSubdir,
                         srcFilename, callback) {
                    var srcLabel = labelDir(srcRootdir),
                        srcRelpath = join(srcSubdir || '', srcFilename),
                        destAbspath = join(dir, srcRelpath),
                        matchList = [];
                    
                    // if label not defined, init index objects
                    if (labels.indexOf(srcLabel) === -1) {
                        labels.push(srcLabel);
                        fileLists[srcLabel] = [];
                    }
                    
                    // if a collision is already recorded, the file must be
                    // checked against multiple destinations.
                    // if not, check if a dest is already present.
                    return Promise.all([ 
                        fileHash(srcAbspath),
                        function getDestHashes() {
                            if(srcRelpath in clashes) {
                                return clashes[srcRelpath].map(function getHash(clash) {
                                    return clash.hash;
                                });
                            }
                            if(grunt.file.isFile(destAbspath)) {
                                return fileHash(destAbspath)
                                    .then(function formatHash(hash) {
                                        return {}
                                    });
                            }
                            return '';
                        }
                    }).then(function compareHashes(hashArray) {
                        
                    });

                    if (matchList.length !== 0) {
                        return fileHash.then(function
                        var srcHash = fileHash(srcAbspath,
                        fileHash(abspath, function(err, hash) {
                            if (err) {
                                callback(err);
                            }
                            var isClash = matchList.some( function compareHash(hash) {
                                
                            });
                        });
                    }

                }
            }

        },

        hasMeta: hasMeta

    };
};
