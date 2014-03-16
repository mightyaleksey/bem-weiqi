'use strict';

var fs = require('vow-fs');
var vow = require('vow');

module.exports = require('enb/lib/build-flow').create()
    .name('bemdecl-from-levels')
    .target('target', '?.bemdecl.js')
    .defineOption('levels', [])
    .builder(function () {
        var levels = this.getOption('levels');

        return vow.all(levels.map(dirlist))
            .then(flatten)
            .then(toBlock)
            .then(toBemdecl);
    })
    .createTech();

function dirlist(level) {
    return fs.listDir(level);
}

function flatten(arr) {
    return arr.reduce(function (rs, arr) {
        return rs.concat(arr);
    }, []);
}

function toBlock(dirlist) {
    return dirlist.map(function (dir) {
        return {block: dir};
    });
}

function toBemdecl(data) {
    return 'exports.deps = ' + JSON.stringify(data, null, 4) + ';';
}
