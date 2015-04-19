var path = require('path');

module.exports = function dirLabel(path, hash) {
    // as default id, append the first 8 digits of the hash to the
    // file path, before the extension (if any)
    
    var id = hash.slice(0, 8);
    var dotPos = path.lastIndexOf('.');
    if (dotPos !== -1 && dotPos !== 0) {
        // file has extension
        return path.substring(0, dotPos) +
            '.' + id + path.substring(dotPos, path.length);
    }

    // no extension
    return path + '.' + id;
}
