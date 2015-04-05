/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */

'use strict';

var mergeMeta = require('./lib/merge-meta'),
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
                } else if (mergeMeta.hasMeta(path)) {
                    goodSrc = false;
            });
            return goodSrc && goodDest;
        })
        .forEach(function(mapping) {
            mapping.src.forEach(function (srcPath) {
                var label = options.label(srcPath),
                    copyMappings = [],
                    addCopyMapping(srcFile, destFile) {
                        copyMappings.push(srcFile, destFile);
                    };
                grunt.file.recurse(srcPath, function mergeFiles(abspath,
                        rootdir, subdir, filename) {

                    grunt.log.ok(abspath);
                    grunt.log.ok(rootdir);
                    grunt.log.ok(subdir);
                    grunt.log.ok(filename);
                });
            });
        });
  });

};
