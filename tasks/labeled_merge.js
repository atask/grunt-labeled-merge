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
    Promise = require('core-js/library/es6/promise'),
    sep = require('path').sep;
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
    
  grunt.registerMultiTask('labeled_merge', 'Merges folders without overwriting files.', function(done) {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
            label: function(srcPath) {
                // Use millisecs as a label
                return Date.now();
            }
        });

    // Iterate over all specified file groups.
    this.files
        .filter(function(mapping) {
            // if not working with folders, forget it
            var goodSrc = true;
            mapping.src.forEach(function noDirIn(path) {
                if (!grunt.file.isDir(path)) {
                    goodSrc = false;
                } else if (mergeMeta.hasMeta(path)) {
                    goodSrc = false;
                }
            });
            // if source folders ok, init dest if necessary
            if (goodSrc && !grunt.file.exists(mapping.dest)) {
                grunt.file.mkdir(mapping.dest);
            }
            return goodSrc;
        })
        .forEach(function(mapping) {
            
            var copyMappings = [],
                meta = mergeMeta.create({
                    dir: mapping.dest,
                    labelFunc: options.label,
                    copyfunc: function addCopyMapping(srcFile, destFile) {
                        copyMappings.push(srcFile, destFile);
                    },
                    grunt: grunt
                });

            var fileMergePromises = [];
            mapping.src.forEach(function mergeDir(srcPath) {
                grunt.file.recurse(srcPath, function mergeFile() {
                    fileMergePromises.push(meta.addFile(arguments));
                }); 
            });
            Promise.all(fileMergePromises).then(done);
        });
  });

};
