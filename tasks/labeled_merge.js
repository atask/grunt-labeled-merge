/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */

'use strict';

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
    });

    grunt.log.ok('INSIDE');
    // Iterate over all specified file groups.
    this.files
        .filter(function(mapping) {
            // if not working with folders, forget it
            var goodSrc = true,
                goodDest = grunt.file.isDir(mapping.dest);
            mapping.src.forEach(function noDirIn(path) {
                if (grunt.file.isDir(path)) {
                    goodSrc = false;
                }
            });
            return goodSrc && goodDest;
        })
        .forEach(function(mapping) {
            mapping.src.forEach(function (srcPath) {
            grunt.log.ok(JSON.stringify(mapping));
                var label = this.options.label(srcPath);
                grunt.log.ok('ROOT: ' + srcPath);
                grunt.log.recurse(srcpath, function(abspath) {
                    grunt.log.ok(abspath);
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
