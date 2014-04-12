var use = require('./techs');

module.exports = function (config) {
    config.node('desktop.bundle', function (nodeConfig) {
        /* Уровни для большинства технологий */
        nodeConfig.addTech(use('levels', {target: '__?.levels', levels: desktopLevels()}));

        /* Файлы для bemtree */
        nodeConfig.addTechs([
            use('bemdecl-from-levels', {target: '__?.bt.bemdecl.js', levels: bemtreeLevels()}),
            use('deps', '__?.bt', {levelsTarget: '__?.levels'}),
            use('files', '__?.bt', {levelsTarget: '__?.levels'})
        ]);

        /* Файлы для bemhtml и статики */
        nodeConfig.addTechs([
            use('bemjson-from-bemtree', {target: '__?.bemjson.js', levels: desktopLevels()}),
            use('bemdecl-from-bemjson', {destTarget: '__?.bemdecl.js', sourceTarget: '__?.bemjson.js'}),
            use('deps-with-modules', '__?'),
            use('files', '__?')
        ]);

        /* Статика */
        nodeConfig.addTechs([
            /* Стили */
            use('css', {target: '_?.css', filesTarget: '__?.files'}),
            /* Клиентский js + модули */
            use('browser-js', {target: '_?.browser.js', filesTarget: '__?.files'}),
            use('prepend-modules', {target: '_?.js', source: '_?.browser.js'})
        ]);

        nodeConfig.mode('development', function (nodeConfig) {
            nodeConfig.addTechs([
                use('bemtree', {filesTarget: '__?.bt.files', devMode: true}),
                use('bemhtml', {filesTarget: '__?.files', devMode: true}),
                use('file-copy', {destTarget: '?.css', sourceTarget: '_?.css'}),
                use('file-copy', {destTarget: '?.js', sourceTarget: '_?.js'})
            ]);
        });

        nodeConfig.mode('production', function (nodeConfig) {
            nodeConfig.addTechs([
                use('bemtree', {filesTarget: '__?.bt.files', devMode: false}),
                use('bemhtml', {
                    filesTarget: '__?.files',
                    devMode: false
                    // cache: true
                }),
                use('borschik', {destTarget: '?.css', sourceTarget: '_?.css', minify: true}),
                use('borschik', {destTarget: '?.js', sourceTarget: '_?.js', minify: true})
            ]);
        });

        nodeConfig.addTargets([
            '?.bemhtml.js',
            '?.bemtree.js',
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
