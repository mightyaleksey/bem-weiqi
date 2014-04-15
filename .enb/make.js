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

    config.nodes('desktop.blocks/*/examples/*');

    config.nodeMask(/examples\/./i, function (nodeConfig) {
        nodeConfig.addTechs([
            use('levels', '__?', {levels: exampleLevels(nodeConfig)}),
            use('file-provider', {target: '?.bemjson.js'}),
            use('bemdecl-from-bemjson', '__?', {sourceTarget: '?.bemjson.js'}),
            use('deps-with-modules', '__?'),
            use('files', '__?')
        ]);

        nodeConfig.addTech(use('bemhtml', '__?'));

        nodeConfig.addTech(use('css', '__?', {target: '_?.css'}));

        nodeConfig.addTechs([
            use('browser-js', '__?'),
            use('prepend-modules', {target: '_?.js', source: '__?.browser.js'})
        ]);

        nodeConfig.addTech(use('html-from-bemjson', '_?', {
            bemhtmlTarget: '__?.bemhtml.js',
            bemjsonTarget: '?.bemjson.js'
        }));

        nodeConfig.addTargets([
            '_?.html',
            '_?.css',
            '_?.js'
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

function exampleLevels(nodeConfig) {
    return desktopLevels()
        .concat(nodeConfig.resolvePath('blocks'));
}

/**
 * Хелперы
 */

var path = require('path');

/* Локальные блоки */
var app = map();
/* Чужие блоки */
var lego = map('base');

function map() {
    var abspath = path.resolve(path.join.apply(path, arguments));
    return function (folder) {
        return path.join(abspath, folder);
    }
}
