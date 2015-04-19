var path = require('path');

module.exports = function dirLabel(path) {
    // as default label, use dir name

    var nPath = path.normalize(path);

    // regex matches 'subdir' in '/dir/subdir/' or '/dir/subdir'
    var dirNameRE = /\/([^\/]+)\/?$/;

    var regexRes = dirNameRE.exec(nPath);
    
    // return regex result
    return regexRes[1];
}
