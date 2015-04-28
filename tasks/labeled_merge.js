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
            currentPromise;

        // Iterate over all specified file groups.
        this.files.forEach(function(mapping) {
            mapping.src.forEach(function(srcFolder) {
                var srcPromise = mergeMeta.merge(mapping.dest, srcFolder, self.options);
                debug(
                    'Processing: ' + eol +
                    '\t' + 'srcFolder :[' + srcFolder + ']' + eol +
                    '\t' + 'mapping.dest :[' + mapping.dest + ']'
                );
                if (currentPromise) {
                    currentPromise.then(function chainNextSrc() {
                        return srcPromise;
                    });
                }
                currentPromise = srcPromise;
            });
        });

        currentPromise
            .then(done)
            .catch(grunt.fail);

    });
};
