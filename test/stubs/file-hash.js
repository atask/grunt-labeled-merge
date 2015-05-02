'use strict';
var Promise = require('core-js/library/es6/promise'),
    hashCounter= 0;

function pad(string, size) {
    var s = string;
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}

module.exports = function fileHash() {
    hashCounter += 1;
    var hashHex = pad(hashCounter.toString(16), 32);
    return Promise.resolve(hashHex);
};
