var Promise = require('core-js/library/es6/promise');
var merger = require('../tasks/lib/merge-meta');
var EventEmitter = require('events').EventEmitter;

var dest = '../tmp/default_options_initial',
    src = 'fixtures/second';

merger.merge(dest, src)
    .then( function() {
        console.log('OK');
        radium.removeAllListeners('radiation');
    })
    .catch( function(err) {
        console.error(err);
        radium.removeAllListeners('radiation');
    });

var radium = new EventEmitter();

radium.on('radiation', function(ray) {
    console.log(ray);
});

setInterval(function() {
    radium.emit('radiation', 'GAMMA');
}, 1000);
