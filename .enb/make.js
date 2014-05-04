module.exports = function (config) {
    config.mode('examples', function () {
        config.nodes('common.blocks/*/examples/*');
        config.nodes('desktop.blocks/*/examples/*');
    });

    config.nodeMask(/(?:common|desktop)\.blocks/, function (node) {
        node.addTechs([
            use('levels', {
                levels:             levels(),
                target:             '__?.levels'
            }),
            use('file-provider', {
                target:             '?.bemjson.js'
            }),
            use('bemdecl-from-bemjson', {
                destTarget:         '__?.bemdecl.js'
            }),
            use('deps-with-modules', {
                bemdeclTarget:      '__?.bemdecl.js',
                levelsTarget:       '__?.levels',
                depsTarget:         '__?.deps.js'
            }),
            use('files', {
                depsTarget:         '__?.deps.js',
                levelsTarget:       '__?.levels',
                filesTarget:        '__?.files',
                dirsTarget:         '__?.dirs'
            })
        ]);

        node.addTech(use('html-from-bemjson', {
            bemhtmlTarget:      '_?.bemhtml',
            destTarget:         'index.html'
        }));

        node.addTech(use('css', {
            target:                 '_?.css',
            filesTarget:            '__?.files'
        }));

        node.addTechs([
            use('browser-js', {
                target:             '_?.js',
                filesTarget:        '__?.files'
            }),
            use('prepend-modules', {
                source:             '_?.js',
                target:             '_?.browser.js'
            })
        ]);

        node.mode('development', function (node) {
            node.addTech(use('bemhtml', {
                target:             '_?.bemhtml',
                filesTarget:        '__?.files',
                devMode: true,
                cache: false
            }));

            node.addTech(use('file-copy', {
                sourceTarget:       '_?.browser.js',
                destTarget:         '?.browser.js'
            }));

            node.addTech(use('file-copy', {
                sourceTarget:       '_?.css',
                destTarget:         '?.css'
            }));
        });

        node.mode('production', function (node) {
            node.addTech(use('bemhtml', {
                target:             '_?.bemhtml',
                filesTarget:        '__?.files',
                devMode: false,
                cache: false
            }));

            node.addTech(use('borschik', {
                sourceTarget:       '_?.browser.js',
                destTarget:         '?.browser.js',
                minify: true
            }));

            node.addTech(use('borschik', {
                sourceTarget:       '_?.css',
                destTarget:         '?.css',
                minify: true
            }));
        });

        node.mode('examples', function (node) {
            node.addTech(use('bemhtml', {
                target:             '_?.bemhtml',
                filesTarget:        '__?.files',
                devMode: true,
                cache: false
            }));

            node.addTech(use('file-copy', {
                sourceTarget:       '_?.browser.js',
                destTarget:         'browser.js'
            }));

            node.addTech(use('file-copy', {
                sourceTarget:       '_?.css',
                destTarget:         'common.css'
            }));
        });

        node.mode('examples', function (node) {
            node.addTargets([
                'index.html',
                'browser.js',
                'common.css'
            ]);
        });
    });

    config.node('tests/mocha/examples/10-tests', function (node) {
        node.addTechs([
            use('levels', {
                levels:         testLevels(),
                target:         '__?.test.levels'
            }),
            use('bemdecl-from-levels', {
                levels:         testLevels(),
                target:         '__?.test.bemdecl.js'
            }),
            use('deps-with-modules', {
                bemdeclTarget:  '__?.test.bemdecl.js',
                levelsTarget:   '__?.test.levels',
                depsTarget:     '__?.test.deps.js',
                sourceSuffixes: ['test.js', 'vanilla.js', 'js', 'browser.js']
            })
        ]);

        node.addTechs([
            use('levels', {
                levels:         allLevels(),
                target:         '__?.all.levels'
            }),
            use('file-provider', {
                target:         '?.bemjson.js'
            }),
            use('bemdecl-from-bemjson', {
                destTarget:     '__?.page.bemdecl.js'
            }),
            use('deps-with-modules', {
                bemdeclTarget:  '__?.page.bemdecl.js',
                levelsTarget:   '__?.all.levels',
                depsTarget:     '__?.page.deps.js'
            })
        ]);

        node.addTechs([
            use('deps-merge', {
                depsSources:    ['__?.test.deps.js', '__?.page.deps.js'],
                depsTarget:     '__?.all.deps.js'
            }),
            use('files', {
                depsTarget:     '__?.all.deps.js',
                levelsTarget:   '__?.all.levels',
                filesTarget:    '__?.all.files',
                dirsTarget:     '__?.all.dirs'
            })
        ]);

        node.addTech(use('bemhtml', {
            target:             '_?.bemhtml',
            filesTarget:        '__?.all.files',
            devMode: false,
            cache: false
        }));

        node.addTech(use('html-from-bemjson', {
            bemhtmlTarget:      '_?.bemhtml',
            destTarget:         'index.html'
        }));

        node.addTechs([
            use('css', {
                target:         '_?.css',
                filesTarget:    '__?.all.files'
            }),
            use('borschik', {
                sourceTarget:   '_?.css',
                destTarget:     'common.css',
                minify: false
            })
        ]);

        node.addTechs([
            use('browser-js', {
                target:         '_?.raw.js',
                filesTarget:    '__?.all.files',
                sourceSuffixes: ['test.js', 'vanilla.js', 'js', 'browser.js']
            }),
            use('prepend-modules', {
                source:         '_?.raw.js',
                target:         '_?.browser.js'
            }),
            use('borschik', {
                sourceTarget:   '_?.browser.js',
                destTarget:     'browser.js',
                minify: false
            })
        ]);

        node.mode('tests', function (node) {
            node.addTargets([
                'index.html',
                'browser.js',
                'common.css'
            ]);
        });
    });
};

function levels() {
    var path = require('path');
    var levels = [
        path.resolve('base/bem-core/common.blocks'),
        path.resolve('base/bem-core/desktop.blocks'),
        path.resolve('common.blocks'),
        path.resolve('desktop.blocks')
    ];

    return levels;
}

function allLevels() {
    var path = require('path');
    var levels = [
        path.resolve('base/bem-core/common.blocks'),
        path.resolve('base/bem-core/desktop.blocks'),
        path.resolve('common.blocks'),
        path.resolve('desktop.blocks'),
        path.resolve('tests')
    ];

    return levels;
}

function testLevels() {
    var path = require('path');
    var levels = [
        path.resolve('common.blocks'),
        path.resolve('desktop.blocks')
    ];

    return levels;
}

function use(techName, targets) {
    typeof targets === 'undefined' && (targets = {});
    return [require(tech(techName)), targets];
}

function tech(techName) {
    var techs = {
        'bemdecl-from-levels':  './',
        'bem-xjst':             'enb-bemxjst',
        'bemhtml-old':          'enb-bemxjst',
        'bemhtml':              'enb-bemxjst',
        'bemtree-old':          'enb-bemxjst',
        'bemtree':              'enb-bemxjst',
        'deps-with-modules':    'enb-modules',
        'prepend-modules':      'enb-modules'
    };

    return [
        techs[techName] || 'enb',
        'techs',
        techName
    ].join('/');
}
