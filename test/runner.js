var Promise = require('core-js/library/es6/promise');
var merger = require('../tasks/lib/merge-meta');

var dest = '../tmp/default_options_initial',
    src = 'fixtures/first';

merger.merge(dest, src)
    .then( function() {
        console.log('OK');
    })
    .catch( function(err) {
        console.error(err);
    });
