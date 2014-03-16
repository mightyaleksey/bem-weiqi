modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    dom.decl({
        block: 'scheme',
        modName: 'theme',
        modVal: 'casual'
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
