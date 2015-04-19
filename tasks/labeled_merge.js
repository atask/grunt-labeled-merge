/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */

'use strict';

var mergeMeta = require('./lib/merge-meta'),
    Promise = require('core-js/library/es6/promise');

module.exports = function(grunt) {
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    
    grunt.registerMultiTask('labeled_merge', 'Merges folders without overwriting files.', function(done) {
        // Iterate over all specified file groups.
        this.files.forEach(function(mapping) {
            var mergePromises = mapping.src.map(function mergeDir(src) {
                return mergeMeta.merge(mapping.dest, src, this.options);
            });
            Promise.all(mergePromises)
                .then(done)
                .catch(done);
        });
    });
};
