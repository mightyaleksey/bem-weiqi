/* borschik:include:../../../../node_modules/mocha/mocha.js */

mocha.setup('bdd');

modules.require(['jquery', 'tests'], function ($) {
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
});
