modules.define('weiqi', ['inherit'],
    function (provide, inherit) {
'use strict';

var weiqi = inherit(events.Emitter, {
    __constructor: function () {}
});

provide(weiqi);

});
