var Promise = require('core-js/library/es6/promise');
var merger = require('../tasks/lib/merge-meta');
var fakeHasher = require('./stubs/file-hash.js');
var EventEmitter = require('events').EventEmitter;

merger.merge('../tmp/runnerDest', '../tmp/runnerSrc1', { getHash: fakeHasher })
    .then( function() {
        console.log('OK1');
        return merger.merge('../tmp/runnerDest', '../tmp/runnerSrc2', { getHash: fakeHasher });
    })
    .then (function() {
        console.log('OK2');
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
