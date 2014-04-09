'use strict';

module.exports = use;
use.extend = extend;

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

function use(techName, prefix, options) {
    var undef;

    if (typeof prefix !== 'string') {
        options = prefix;
        prefix = undef;
    }

    options || (options = {});

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

function extend(moduleName, techName, options) {
    var hash;

    if (typeof techName === 'string') {
        hash = {};
        hash[techName] = options;
    } else {
        hash = techName;
    }

    modules[moduleName] || (modules[moduleName] = new Module(moduleName));

    Object.keys(hash).forEach(function (tech) {
        techs[tech] = new Tech(tech).options(hash[tech]);
        techs[tech].module = modules[moduleName];
    });
}
