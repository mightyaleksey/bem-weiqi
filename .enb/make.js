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

function use(techName, prefix, options) {
    var undef;

    if (typeof prefix !== 'string') {
        options = prefix;
        prefix = undef;
    }

    return [
        techs(techName),
        techOptions(techName, prefix, options)
    ];
}


function techs(techName) {
    var techs = {
        'bemdecl-from-bemjson':      require('enb/techs/bemdecl-from-bemjson'),
        'bemdecl-from-deps-by-tech': require('enb/techs/bemdecl-from-deps-by-tech'),
        'bemdecl-merge':             require('enb/techs/bemdecl-merge'),
        'borschik':                  require('enb/techs/borschik'),
        'browser-js':                require('enb/techs/browser-js'),
        'css':                       require('enb/techs/css'),
        'deps':                      require('enb/techs/deps'),
        'deps-old':                  require('enb/techs/deps-old'),
        'file-copy':                 require('enb/techs/file-copy'),
        'files':                     require('enb/techs/files'),
        'html-from-bemjson':         require('enb/techs/html-from-bemjson'),
        'levels':                    require('enb/techs/levels'),
        'node-js':                   require('enb/techs/node-js'),
        'vanilla-js':                require('enb/techs/vanilla-js'),

        'bemhtml':                   require('enb-bemxjst/techs/bemhtml'),
        'bemtree':                   require('enb-bemxjst/techs/bemtree'),

        'deps-with-modules':         require('enb-modules/techs/deps-with-modules'),
        'prepend-modules':           require('enb-modules/techs/prepend-modules'),

        'bemdecl-from-levels':       require('./techs/bemdecl-from-levels'),
        'bemjson-from-bemtree':      require('./techs/bemjson-from-bemtree')
    };

    return techs[techName];
}

function techOptions(techName, prefix, options) {
    var defined = {
        'bemdecl-from-bemjson':      {destTarget: '?.bemdecl.js', sourceTarget: '?.bemjson.js'},
        'bemdecl-from-deps-by-tech': {target: '?.bemdecl.js', filesTarget: '?.files', sourceTech: 'js', destTech: 'bemhtml'},
        'bemdecl-merge':             {bemdeclTarget: '?.bemdecl.js'},
        'browser-js':                {target: '?.browser.js', filesTarget: '?.files'},
        'css':                       {target: '?.css', filesTarget: '?.files'},
        'deps':                      {depsTarget: '?.deps.js', bemdeclTarget: '?.bemdecl.js', levelsTarget: '?.levels'},
        'deps-old':                  {depsTarget: '?.deps.js', bemdeclTarget: '?.bemdecl.js', levelsTarget: '?.levels'},
        'files':                     {filesTarget: '?.files', dirsTarget: '?.dirs', depsTarget: '?.deps.js', levelsTarget: '?.levels'},
        'html-from-bemjson':         {destTarget: '?.html', bemhtmlTarget: '?.bemjson.js', bemjsonTarget: '?.bemhtml.js'},
        'js':                        {target: '?.js', filesTarget: '?.files'},
        'levels':                    {target: '?.levels'},
        'node-js':                   {target: '?.node.js', filesTarget: '?.files'},
        'vanilla-js':                {target: '?.vanilla.js', filesTarget: '?.files'},

        'deps-with-modules':         {depsTarget: '?.deps.js', bemdeclTarget: '?.bemdecl.js', levelsTarget: '?.levels'}
    };

    var defaults = defined[techName];
    options || (options = {});

    if (typeof prefix === 'undefined' || !defaults) {
        return options;
    }

    var merged = {};

    for (var key in defaults) {
        if (!defaults.hasOwnProperty(key)) {
            continue;
        }
        merged[key] = defaults[key].replace('?', prefix);
    }

    for (var key in options) {
        if (!options.hasOwnProperty(key)) {
            continue;
        }
        merged[key] = options[key];
    }

    return merged;
}
