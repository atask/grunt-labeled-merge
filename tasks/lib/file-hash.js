var os = require('os'),
    crypto = require('crypto'),
    fs = require('fs'),
    Promise = require('core-js/library/es6/promise'),
    // change the algo to sha1, sha256 etc according to your requirements
    algo = 'md5';

module.exports = function fileHash(path) {
    'use strict';
    var shasum = crypto.createHash(algo),
        stream = fs.ReadStream(path),
        readStr;
    return new Promise(function calcHash(resolve, reject) {
        stream
            .on('error', reject)
            .on('data', function(data) {
                readStr = data.toString('utf8');
                // if Windows, end-of-line encoding will
                // generate a different MD5 hash.
                // Better replace it.
                if (os.EOL === '\r\n') {
                    readStr = readStr.replace('\r\n', '\n');
                }
                shasum.update(readStr);
            })
            .on('end', function digest() {
                var hash = shasum.digest('hex');
                resolve(hash);
            });
    });
};
