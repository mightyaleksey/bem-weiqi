modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    dom.decl('go', {
        /**
         * Кэширует и возвращает ссылку на доску.
         * @return {BEM.DOM}
         */
        getGoban: function () {
            return this.goban ||
                (this.goban = this.findBlockInside('goban'));
        }
    }, {
        live: true
    });

    provide(dom);
});
