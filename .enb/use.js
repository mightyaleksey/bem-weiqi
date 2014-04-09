'use strict';

module.exports = use;
use.extend = extend;

var inherit = require('inherit');
var _ = require('underscore');

/**
 * Хранилище технологий
 * @type {Object}
 */
var techs = {};
/**
 * Хранилище модулей
 * @type {Object}
 */
var modules = {};

/**
 * Маленький конструктор для модулей.
 */
var Module = inherit({
    /**
     * Конструктор.
     * @param  {String} moduleName Название модуля
     * @return {Module}
     */
    __constructor: function (moduleName) {
        this.module = moduleName;
    },
    /**
     * Подключает технологию из данного модуля.
     * @param  {String} techName Название технологии.
     * @return {Any}
     */
    req: function (techName) {
        var chunks = [
            this.module,
            'techs',
            techName
        ];

        return require(chunks.join('/'));
    }
});

/**
 * Маленький конструктор для технологий.
 */
var Tech = inherit({
    /**
     * Конструктор.
     * @param  {String} techName Название технологии.
     * @return {Tech}
     */
    __constructor: function (techName) {
        this.tech = techName;
    },
    /**
     * Устанавливает или возвращает список целей,
     * используемых по умолчанию.
     * @param  {Object}      [targets] Список целей.
     * @return {Object|Tech}           Если не указан, возвращает сохраненное значение.
     */
    options: function (targets) {
        if (typeof targets === 'undefined') {
            return this.targets || {};
        } else {
            this.targets = targets;
            return this;
        }
    },
    /**
     * Подключает технологию.
     * Использует свойство `module` для получения ссылки на сам модуль.
     * @return {Any}
     */
    req: function () {
        return this.module.req(this.tech);
    }
});

/**
 * Небольшой сахарок для подключения требуемой технологии для сборки.
 * @param  {String} techName Название технологии. Например, 'files'.
 * @param  {String} prefix   Префикс для целей. Вставляется вместо '?'. Например, '__?'.
 * @param  {Object} options  Список параметров для технологии.
 * @return {Array}
 */
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
        var defined = tech.options();
        targets = {};

        _.each(defined, function (val, key) {
            targets[key] = defined[key].replace('?', prefix);
        });

        _.extend(targets, options);
    }

    return [
        tech.req(),
        targets
    ];
}

/**
 * Декларирует список технологий для фунции use.
 * В качестве аргумента techName можно передавать объект,
 * в котором в качестве ключей будут выступать названия технологий,
 * а значения - цели.
 * @param {String}        moduleName Название модуля. Например, 'enb-bemxjst'.
 * @param {String|Object} techName   Название технологии. Например, 'files'.
 * @param {Object}        [options]  Список целей, используемых по умолчанию данной технологией.
 */
function extend(moduleName, techName, options) {
    var hash;

    if (typeof techName === 'string') {
        hash = {};
        hash[techName] = options;
    } else {
        hash = techName;
    }

    modules[moduleName] || (modules[moduleName] = new Module(moduleName));

    _.each(hash, function (targets, tech) {
        techs[tech] = new Tech(tech).options(targets);
        techs[tech].module = modules[moduleName];
    });
}
