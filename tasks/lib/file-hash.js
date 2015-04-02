var crypto = require('crypto'),
    fs = require('fs'),
    // change the algo to sha1, sha256 etc according to your requirements
    algo = 'md5';

module.exports = function fileHash(path, callback) {
    var shasum = crypto.createHash(algo),
        s = fs.ReadStream(path);
    s.on('error', callback(new Error('Read stream error')));
    s.on('data', function(d) { shasum.update(d); });
    s.on('end', function() {
        var d = shasum.digest('hex');
        callback(null, d);
    });
}
