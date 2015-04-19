var grunt = require('grunt'),
    getFileHash = require('./file-hash'),
    join = require('path').join;

    var META_DIR = '.meta',
        LIST_FILE = 'files.json',
        // a dot and 8 hex lowercase chars
        FILE_ID_RE = /\.[\da-f]{8}/;
    
    function hasMeta(dir) {
        var meta = grunt.file.isDir(dir, META_DIR),
            files = grunt.file.isFile(dir, META_DIR, LIST_FILE);
        return (meta && files);
    }

    module.exports = {
        create: function create(params) {

            var files = {},
                destRootdir = params.dir,
                labelDir = params.labelFunc,
                queueFileCopy = params.copyFunc,
                hasMeta = hasMeta(dir);

            function hasFileId(filename) {
                return FILE_ID_RE.test(filename);
            }

            function addFileId(filename, id) {
                var dotPos = filename.lastIndexOf('.');
                if (dotPos !== -1 && dotPos !== 0) {
                    // file has extension
                    return filename.substring(0, dotPos) + 
                        '.' + id + filename.substring(dotPos, filename.length);
                } else {
                    // no extension
                    return destTestPath + '.' + id;
                }
            }

            function removeFileId(filename) {
                return filename.replace(FILE_ID_RE, '');
            }

            if (hasMeta) {
                files = grunt.file.readJSON(destRootdir, META_DIR, LIST_FILE);
            } else {
                grunt.file.mkdir(join(destRootdir, META_DIR));
            }

            return {
                addFile: function addFile(srcAbspath, srcRootdir, srcSubdir,
                         srcFilename) {
                    var srcLabel = labelDir(srcRootdir),
                        srcRelpath = join(srcSubdir || '', srcFilename),
                        srcHash;

                    function importFile() {
                        var destAbspath = addFileId(
                            join(destRootdir, srcRelpath),
                            srcHash.slice(0,8)
                        );
                        queueFileCopy(srcAbspath, destAbspath);
                    }

                    return getFileHash(srcAbspath)
                        .then(function manageFile(fileHash) {
                            srcHash = fileHash;
                            if (srcRelpath in files) {
                                if (fileHash in files[srcRelpath]) {
                                    files[srcRelpath].push(srcLabel);
                                } else {
                                    files[srcRelpath][fileHash] = [srcLabel];
                                    importFile();
                                }
                            } else {
                                files[srcRelpath] = {};
                                files[srcRelpath][fileHash] = [srcLabel];
                                importFile();
                            }
                        });
                },

                close: function close() {
                    grunt.file.write(join(destRootDir, META_DIR, LIST_FILE),
                            JSON.stringify(files));
                }
            }

        },

        hasMeta: hasMeta

};
