var path = require('path'),
    verEx = require('verbal-expressions');

module.exports = function dirLabel(srcPath) {
    'use strict'; 

    // as default label, use dir name

    var nPath = path.normalize(srcPath);
 
    // build a regex for matching 'subdir' in '/dir/subdir/' or '/dir/subdir'
    var dirNameRE = verEx()
        .find(path.sep)
        .beginCapture()
        .anythingBut(path.sep)
        .endCapture()
        .maybe(path.sep)
        .endOfLine();

    var regexRes = dirNameRE.exec(nPath);
    
    // return regex result
    return regexRes[1];
};
