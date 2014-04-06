module.exports = function (config) {
    config.node('desktop.bundle', function (nodeConfig) {
        nodeConfig.addTechs([
            /* Сборка bemtree по уровням */
            use('levels', {levels: desktopLevels()}),
            use('bemdecl-from-levels', {
                levels: bemtreeLevels(),
                target: '?.bemtree.bemdecl.js'
            }),
            use('deps', {
                bemdeclTarget: '?.bemtree.bemdecl.js',
                depsTarget: '?.bemtree.deps.js'
            }),
            use('files', {
                depsTarget: '?.bemtree.deps.js',
                filesTarget: '?.bemtree.files',
                dirsTarget: '?.bemtree.dirs'
            }),
            use('bemtree', {filesTarget: '?.bemtree.files'}),

            /* Сборка статики + bemhtml из bemtree */
            use('bemjson-from-bemtree', {levels: desktopLevels()}),
            use('bemdecl-from-bemjson'),
            use('deps-with-modules'),
            use('files'),
            use('bemhtml'),
            use('css'),
            use('browser-js'),
            use('prepend-modules', {source: '?.browser.js'})
        ]);

        nodeConfig.addTargets([
            '?.bemtree.js',
            '?.bemhtml.js',
            '?.css',
            '?.js'
        ]);
    });
};

/* Список уровней переопределения для разных целей */
function bemtreeLevels() {
    return [
        app('desktop.blocks')
    ];
}

function desktopLevels() {
    return [
        lego('bem-core/common.blocks'),
        lego('bem-core/desktop.blocks'),
        app('common.blocks'),
        app('desktop.blocks')
    ];
}

/**
 * Хелперы
 */
var techs = {
    'bemdecl-from-bemjson': require('enb/techs/bemdecl-from-bemjson'),
    'browser-js':           require('enb/techs/browser-js'),
    'css':                  require('enb/techs/css'),
    'deps':                 require('enb/techs/deps'),
    'files':                require('enb/techs/files'),
    'levels':               require('enb/techs/levels'),
    'bemhtml':              require('enb-bemxjst/techs/bemhtml'),
    'bemtree':              require('enb-bemxjst/techs/bemtree'),
    'deps-with-modules':    require('enb-modules/techs/deps-with-modules'),
    'prepend-modules':      require('enb-modules/techs/prepend-modules'),
    'bemdecl-from-levels':  require('./techs/bemdecl-from-levels'),
    'bemjson-from-bemtree': require('./techs/bemjson-from-bemtree')
};

function use(techName, options) {
    return [
        techs[techName],
        options || {}
    ];
}

var path = require('path');

/* Локальные блоки */
var app = map();
/* Чужие блоки */
var lego = map('libs');

function map() {
    var abspath = path.resolve(path.join.apply(path, arguments));
    return function (folder) {
        return path.join(abspath, folder);
    }
}
