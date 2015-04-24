var path = require('path');

module.exports = function dirLabel(filePath, hash) {
    'use strict';
    // as default id, append the first 8 digits of the hash to the
    // file path, before the extension (if any)
    
    // get the filename
    var fileName = path.basename(filePath);
    
    // evaluate how far from the end the id should be put
    var targetPos = filePath.length - path.extname(fileName).length;

    var id = hash.slice(0, 8);
    return filePath.substring(0, targetPos) +
        '.' + id + filePath.substring(targetPos, path.length);
};
