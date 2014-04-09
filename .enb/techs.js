'use strict';

var use = require('./use.js');
module.exports = use;

use.extend('enb', {
    'bemdecl-from-bemjson': {
        destTarget: '?.bemdecl.js',
        sourceTarget: '?.bemjson.js'
    },
    'bemdecl-from-deps-by-tech': {
        target: '?.bemdecl.js',
        filesTarget: '?.files',
        sourceTech: 'js',
        destTech: 'bemhtml'
    },
    'bemdecl-merge': {
        bemdeclTarget: '?.bemdecl.js'
    },
    'borschik': {},
    'browser-js': {
        target: '?.browser.js',
        filesTarget: '?.files'
    },
    'css': {
        target: '?.css',
        filesTarget: '?.files'
    },
    'deps': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'deps-old': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'file-copy': {},
    'files': {
        filesTarget: '?.files',
        dirsTarget: '?.dirs',
        depsTarget: '?.deps.js',
        levelsTarget: '?.levels'
    },
    'html-from-bemjson': {
        destTarget: '?.html',
        bemhtmlTarget: '?.bemjson.js',
        bemjsonTarget: '?.bemhtml.js'
    },
    'js': {
        target: '?.js',
        filesTarget: '?.files'
    },
    'levels': {
        target: '?.levels'
    },
    'node-js': {
        target: '?.node.js',
        filesTarget: '?.files'
    },
    'vanilla-js': {
        target: '?.vanilla.js',
        filesTarget: '?.files'
    }
});

use.extend('enb-modules', {
    'deps-with-modules': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'prepend-modules': {}
});

use.extend('enb-bemxjst', {
    'bemhtml': {},
    'bemtree': {}
});

use.extend('.', {
    'bemdecl-from-levels': {},
    'bemjson-from-bemtree': {}
});
