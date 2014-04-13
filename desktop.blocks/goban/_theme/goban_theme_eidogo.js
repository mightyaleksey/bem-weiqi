modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    dom.decl({
        block: 'goban',
        modName: 'theme',
        modVal: 'eidogo'
    }, {
        /**
         * Возвращает хеш с цветами
         * @private
         * @return {Object}
         */
        getPalette: function () {
            return {
                dark: '#665544',
                light: '#ddbc6b',
                line: '#ae9454',
                font: '#b6a887'
            };
        }
    });

    provide(dom);
});
