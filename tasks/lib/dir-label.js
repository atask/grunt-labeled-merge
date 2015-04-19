var path = require('path');

module.exports = function dirLabel(srcPath) {
    'use strict'; 

    // as default label, use dir name

    var nPath = path.normalize(srcPath);

    // regex matches 'subdir' in '/dir/subdir/' or '/dir/subdir'
    var dirNameRE = /\/([^\/]+)\/?$/;

    var regexRes = dirNameRE.exec(nPath);
    
    // return regex result
    return regexRes[1];
};
