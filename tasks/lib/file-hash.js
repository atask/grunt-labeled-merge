var crypto = require('crypto'),
    fs = require('fs'),
    Promise = require('core-js/library/es6/promise'),
    // change the algo to sha1, sha256 etc according to your requirements
    algo = 'md5';

module.exports = function fileHash(path) {
    var shasum = crypto.createHash(algo),
        stream = fs.ReadStream(path);
    return new Promise(function calcHash(resolve, reject) {
        stream.on('error', reject)
              .on('data', function(d) { shasum.update(d); })
              .on('end', function digest() {
            var d = shasum.digest('hex');
            resolve(d);
        });
    });
}
