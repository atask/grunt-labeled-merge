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

    // Copy needed fixture files
    copy: {
      fixture: {
        files: [
          {expand: true, cwd: 'test/fixture/first/', src: ['**'], dest: 'tmp/default_options_initial/'},
          {'tmp/default_options_initial/.meta/files.json': 'test/fixtures/metas/first.json'}
        ]
      }
    },

    // Configuration to be run (and then tested).
    labeled_merge: {
      default_options: {
        files: {
            'tmp/default_options_initial': ['test/fixtures/first'],
            'tmp/default_options_first': ['test/fixtures/second']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy:fixture', 'labeled_merge', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
