/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */

'use strict';

var mergeMeta = require('./lib/merge-meta'),
    debug = require('debug')('labeled-merge'),
    eol = require('os').EOL;

module.exports = function(grunt) {
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    
    grunt.registerMultiTask('labeled_merge', 'Merges folders without overwriting files.', function() {
        var done = this.async(),
            self = this,
            flatMappings = [],
            currentPromise;

        // flatten mappings
        this.files.forEach(function(mapping) {
            mapping.src.forEach(function(srcFolder) {
                flatMappings.push({
                    src: srcFolder,
                    dest: mapping.dest
                });
            });
        });

        // Iterate over all available mappings, in order.
        flatMappings.forEach(function(mapping) {
            debug(
                'Processing: ' + eol +
                '\t' + 'mapping.src :[' + mapping.src+ ']' + eol +
                '\t' + 'mapping.dest :[' + mapping.dest + ']'
            );
            if (!currentPromise) {
                // start merges chain
                currentPromise = mergeMeta.merge(mapping.dest, mapping.src, self.options);
            } else {
                // append next merge to the chain
                currentPromise = currentPromise.then(function chainNextMapping() {
                    var dest = mapping.dest,
                        src = mapping.src;
                    return mergeMeta.merge(dest, src, self.options);
                });
            }
        });

        currentPromise
            .then(done)
            .catch(grunt.fail);

    });
};
