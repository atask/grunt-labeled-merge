/*
 * grunt-labeled-merge
 * https://github.com/allan/grunt-labeled-merge
 *
 * Copyright (c) 2015 atask
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        labeled_merge: {
            default_options: {
                files: [
                    { dest: 'tmp/default_options_initial', src: ['test/fixtures/first'] },
                    { dest: 'tmp/default_options_two_pass', src: [
                        'test/fixtures/first',
                        'test/fixtures/second'
                    ] }
                ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        instrument: {
            files: 'tasks/**/*.js',
            options: {
                lazy: true,
                basePath: 'test/coverage/instrument/'
            }
        },
        
        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },

        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: 'html',
                dir: 'test/coverage/reports'
            }
        }
    });

    // If available, load this plugin's instrumented task(s).
    if (grunt.file.exists('test/coverage/instrument/')) {
        grunt.loadTasks('test/coverage/instrument/tasks');
        grunt.task.renameTask('labeled_merge', 'labeled_merge_instrument');
        grunt.config('labeled_merge_instrument', 
            grunt.config('labeled_merge'));
    }

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-istanbul');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'labeled_merge', 'nodeunit']);

    grunt.registerTask('coverage', ['clean', 'labeled_merge_instrument', 'nodeunit', 'storeCoverage', 'makeReport']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
