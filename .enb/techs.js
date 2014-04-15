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
    'bemdecl-provider': {
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
    'css-borschik-chunks': {
        filesTarget: '?.files'
    },
    'css-chunks': {
        filesTarget: '?.files'
    },
    'css-ie': {
        target: '?.ie.css',
        filesTarget: '?.files'
    },
    'css-ie6': {
        target: '?.ie6.css',
        filesTarget: '?.files'
    },
    'css-ie7': {
        target: '?.ie7.css',
        filesTarget: '?.files'
    },
    'css-ie8': {
        target: '?.ie8.css',
        filesTarget: '?.files'
    },
    'css-ie9': {
        target: '?.ie9.css',
        filesTarget: '?.files'
    },
    'css-includes': {
        target: '?.css',
        filesTarget: '?.files'
    },
    'css-less': {
        target: '?.css',
        filesTarget: '?.files'
    },
    'css-stylus': {
        target: '?.css',
        filesTarget: '?.files'
    },
    'css-stylus-with-nib': {
        target: '?.css',
        filesTarget: '?.files'
    },
    'deps': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'deps-merge': {
        depsTarget: '?.deps.js'
    },
    'deps-old': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'deps-provider': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'deps-subtract': {
        depsTarget: '?.deps.js'
    },
    'file-copy': {},
    'file-merge': {},
    'file-provider': {},
    'files': {
        filesTarget: '?.files',
        dirsTarget: '?.dirs',
        depsTarget: '?.deps.js',
        levelsTarget: '?.levels'
    },
    'html-from-bemjson': {
        destTarget: '?.html',
        bemhtmlTarget: '?.bemhtml.js',
        bemjsonTarget: '?.bemjson.js'
    },
    'html-from-bemjson-i18n': {
        destTarget: '?.{lang}.html',
        bemhtmlTarget: '?.bemhtml.js',
        bemjsonTarget: '?.bemjson.js',
        langAllTarget: '?.lang.all.js',
        langTarget: '?.lang.{lang}.js'
    },
    'i18n-lang-js': {
        target: '?.lang.{lang}.js',
        keysetsTarget: '?.keysets.{lang}.js'
    },
    'i18n-lang-js-chunks': {
        target: '?.js-chunks.lang.{lang}.js'
    },
    'i18n-merge-keysets': {
        target: '?.keysets.{lang}.js',
        dirsTarget: '?.dirs'
    },
    'js': {
        target: '?.js',
        filesTarget: '?.files'
    },
    'js-bundle-component': {
        target: '?.bembundle.js'
    },
    'js-bembundle-component-i18n': {
        target: '?.bembundle.{lang}.js'
    },
    'js-bundle-page': {
        target: '?.js'
    },
    'js-bembundle-page-i18n': {
        target: '?.bembundle.{lang}.js'
    },
    'js-chunks': {
        target: '?.js-chunks.js',
        filesTarget: '?.files'
    },
    'js-expand-includes': {},
    'js-i18n': {
        target: '?.{lang}.js',
        filesTarget: '?.files'
    },
    'js-includes': {
        filesTarget: '?.files'
    },
    'levels': {
        target: '?.levels'
    },
    'node-js': {
        target: '?.node.js',
        filesTarget: '?.files'
    },
    'priv-js': {
        target: '?.priv.js',
        bemhtmlTarget: '?.bemhtml.js',
        filesTarget: '?.files'
    },
    'priv-js-i18n-all': {
        target: '?.all.priv.js',
        privJsTarget: '?.priv.js'
    },
    'pub-js-i18n': {
        target: '?.all.pub.js',
        jsTarget: '?.js',
        langTarget: '?.lang.{lang}.js',
        allLangTarget: '?.lang.all.js',
        bemhtmlTarget: '?.bemhtml.js'
    },
    'symlink': {},
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
    'bemhtml': {
        target: '?.bemhtml.js',
        filesTarget: '?.files'
    },
    'bemtree': {}
});

use.extend('.', {
    'bemdecl-from-levels': {},
    'bemjson-from-bemtree': {}
});
