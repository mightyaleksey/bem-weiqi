module.exports = function (techName, prefix, options) {
    var undef;

    if (typeof prefix !== 'string') {
        options = prefix;
        prefix = undef;
    }

    options || (options = {});

    return tech(techName, prefix, options);
}

exports.extend = function (moduleName, techName, options) {
    var hash;

    if (typeof techName === 'string') {
        hash = {};
        hash[techName] = options;
    } else {
        hash = techName;
    }

    extend(moduleName, hash);
}

var inherit = require('inherit');

var techs = {};
var modules = {};

var Module = inherit({
    __constructor: function (moduleName) {
        this.module = moduleName;
    },
    req: function (techName) {
        var chunks = [
            this.module,
            'techs',
            techName
        ];

        return require(chunks.join('/'));
    }
});

var Tech = inherit({
    __constructor: function (techName) {
        this.tech = techName;
    },
    options: function (targets) {
        if (typeof targets === 'undefined') {
            return this.targets || {};
        } else {
            this.targets = targets;
            return this;
        }
    },
    req: function () {
        return this.module.req(this.tech);
    }
});

function tech(techName, prefix, options) {
    var tech = techs[techName];
    var targets;

    if (typeof tech === 'undefined') {
        throw new Error(techName + ' is undefined');
    }

    if (typeof prefix === 'undefined') {
        targets = options;
    } else {
        var o = tech.options();
        targets = {};

        Object.keys(o).forEach(function (key) {
            targets[key] = o[key].replace('?', prefix);
        });

        Object.keys(options).forEach(function (key) {
            targets[key] = options[key];
        });
    }

    return [
        tech.req(),
        targets
    ];
}

function extend(moduleName, hash) {
    modules[moduleName] || (modules[moduleName] = new Module(moduleName));

    Object.keys(hash).forEach(function (tech) {
        techs[tech] = new Tech(tech).options(hash[tech]);
        techs[tech].module = modules[moduleName];
    });
}

extend('enb', {
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

extend('enb-modules', {
    'deps-with-modules': {
        depsTarget: '?.deps.js',
        bemdeclTarget: '?.bemdecl.js',
        levelsTarget: '?.levels'
    },
    'prepend-modules': {}
});

extend('enb-bemxjst', {
    'bemhtml': {},
    'bemtree': {}
});

extend('.', {
    'bemdecl-from-levels': {},
    'bemjson-from-bemtree': {}
});
