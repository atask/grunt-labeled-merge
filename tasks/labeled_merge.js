/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */

'use strict';

var fileHash = require('./lib/fileHash'),
    join = require('path').join,
    sep = require('path').sep;
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    

  grunt.registerMultiTask('labeled_merge', 'Merges folders without overwriting files.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
            label: function(srcPath) {
                // Use millisecs as a label
                return Date.now();
            }
        }),

    // Iterate over all specified file groups.
    this.files
        .filter(function(mapping) {
            // if not working with folders, forget it
            var goodSrc = true,
                goodDest = grunt.file.isDir(mapping.dest);
            mapping.src.forEach(function noDirIn(path) {
                if (!grunt.file.isDir(path)) {
                    goodSrc = false;
                }
            });
            return goodSrc && goodDest;
        })
        .forEach(function(mapping) {
            mapping.src.forEach(function (srcPath) {
                var label = options.label(srcPath),
                    copyMappings = [],
                    mergeIndex = {};
                grunt.file.recurse(srcPath, function mergeFiles(abspath,
                        rootdir, subdir, filename) {

                    var skipFile = false,
                        destTestPath = subdir
                            ? join(mappings.dest, subdir, filename)
                            : join(mappings.dest, filename);

                    // if there is a different version of the same file
                    // save a copy with a labeled name
                    if (grunt.file.exists(destTestPath)) {
                        // check if we need a new copy
                        var srcMD5 = fileHash(abspath),
                            destMD5 = fileHash(destTestPath);
                        if (srcMD5 !== destMD5) {
                            // different files... generate new name
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
                        } else {
                            // same files, don't copy
                            skipFile = true;
                        }
                    }

                    if (!skipFile) {
                        // add mappings for copy task
                        copyMappings.push({
                            src: srcPath,
                            dest: destTestPath
                        });

                        // index the file
                        var deepest = mergeIndex;
                        destTestPath.split(sep).forEach(function traverseIndex(name, index, names) {
                            if (index < names.length - 1) {
                                if (!deepest.name) {
                                    // create object
                                    deepest.name = {};
                                }
                                deepest = deepest.name;
                            }
                        });
                    }
                    grunt.log.ok(abspath);
                    grunt.log.ok(rootdir);
                    grunt.log.ok(subdir);
                    grunt.log.ok(filename);
                });
            });
        });

    /*
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
    */
  });

};
