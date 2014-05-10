modules.define('tree', ['events', 'inherit'],
    function (provide, events, inherit) {
'use strict';

var tree = inherit(events.Emitter, {
    __constructor: function () {}
});

provide(tree);

});
