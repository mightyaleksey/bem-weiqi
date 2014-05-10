modules.define('i-bem__dom',
    function (provide, sgf, tree, weiqi, dom) {
'use strict';

provide(dom.decl({
    block: 'goban',
    modName: 'mode',
    modVal: 'game'
}, {
    onSetMod: {
        js: {
            inited: function () {}
        }
    }
}));

});
