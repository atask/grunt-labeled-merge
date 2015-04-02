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

    return {
        create: function create(dir, labelFunc) {

            var labels = [],
                clashes = {},
                fileLists = {},
                destRootdir = dir,
                labeler = labelFunc,
                hasMeta = hasMeta(dir);

            if (hasMeta) {
                labels = grunt.file.readJSON(destRootdir, META_DIR, LABEL_FILE);
                clashes = grunt.file.reaJSON(destRootdir, META_DIR, CLASH_FILE);
            }

            return {
                addFile: function addFile(srcAbspath, srcRootdir, srcSubdir,
                         srcFilename, callback) {
                    var srcLabel = labeler(srcRootdir),
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
                    if (srcRelpath in clashes) {
                        matchList = clashes[srcRelpath];
                    } else {
                        if(grunt.file.isFile(destAbspath)) {
                            matchList = [destAbspath];
                        }
                    }
                    
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
