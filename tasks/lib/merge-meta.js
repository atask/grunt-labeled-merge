var fileHash = require('./file-hash'),
    join = require('path').join;

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
        create: function create(dir) {

            var labels = [],
                clashes = {},
                fileLists = {},
                hasMeta = hasMeta(dir);

            if (hasMeta) {
                labels = grunt.file.readJSON(dir, META_DIR, LABEL_FILE);
                clashes = grunt.file.reaJSON(dir, META_DIR, CLASH_FILE);
            }

            return {
                addFile: function addFile(fileStats, callback) {
                    var label = fileStats.label,
                        abspath = fileStats.abspath,
                        subdir = fileStats.subdir,
                        filename = fileStats.filename,
                        relpath = join(subdir || '', filename),
                        destPath = join(dir, relPath),
                        matchList = [];
                    
                    // if label not defined, init index objects
                    if (labels.indexOf(label) === -1) {
                        labels.push(label);
                        fileLists[label] = [];
                    }
                    
                    // if a collision is already recorded, the file must be
                    // checked against multiple destinations.
                    // if not, check if a dest is already present.
                    if (relpath in clashes) {
                        matchList = clashes[relpath];
                    } else {
                        if(grunt.file.isFile(destPath)) {
                            matchList = [destPath];
                        }
                    }
                    
                    fileHash(abspath, function(err, hash) {
                        if (err) {
                            callback(err);
                        }
                        var isClash = matchList.some( function compareHash(hash) {
                            
                        });
                    });


                }
            }

        },

        hasMeta: hasMeta

    };
};
