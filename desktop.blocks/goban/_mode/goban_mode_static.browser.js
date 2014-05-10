modules.define('i-bem__dom',
    function (provide, sgf, tree, weiqi, dom) {
'use strict';

provide(dom.decl({
    block: 'goban',
    modName: 'mode',
    modVal: 'static'
}, {
    onSetMod: {
        js: {
            inited: function () {
                var params = this.params;

                /* Рисуем диаграмму */
                if (typeof params.sgf !== 'undefined') {}
            }
        }
    }
}));

});
