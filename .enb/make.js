module.exports = function (config) {
    config.node('desktop.bundle', function (nodeConfig) {
        nodeConfig.addTechs([
            /**
             * Сборка bemtree по уровням
             */
            [
                require('enb/techs/levels'),
                {
                    levels: desktopLevels()
                }
            ],
            [
                require('./techs/bemdecl-from-levels'),
                {
                    levels: bemtreeLevels(),
                    target: '?.bemtree.bemdecl.js'
                }
            ],
            [
                require('enb/techs/deps'),
                {
                    bemdeclTarget: '?.bemtree.bemdecl.js',
                    depsTarget: '?.bemtree.deps.js'
                }
            ],
            [
                require('enb/techs/files'),
                {
                    depsTarget: '?.bemtree.deps.js',
                    filesTarget: '?.bemtree.files',
                    dirsTarget: '?.bemtree.dirs'
                }
            ],
            [
                require('enb-bemxjst/techs/bemtree'),
                {
                    filesTarget: '?.bemtree.files'
                }
            ],

            /**
             * Сборка статики + bemhtml из bemtree
             */
            [
                require('./techs/bemjson-from-bemtree'),
                {
                    levels: desktopLevels()
                }
            ],
            require('enb/techs/bemdecl-from-bemjson'),
            require('enb-modules/techs/deps-with-modules'),
            require('enb/techs/files'),
            require('enb-bemxjst/techs/bemhtml'),
            require('enb/techs/css'),
            require('enb/techs/browser-js'),
            [
                require('enb-modules/techs/prepend-modules'),
                {source: '?.browser.js'}
            ]
        ]);

        nodeConfig.addTargets([
            '?.bemtree.js',
            '?.bemhtml.js',
            '?.css',
            '?.js'
        ]);
    });
}

/**
 * Список уровней переопределения для разных целей
 */
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
