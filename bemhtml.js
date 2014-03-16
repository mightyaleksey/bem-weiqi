/**
 * Небольшой скрипт для проверки собранного bemhtml таргета
 */
var path = require('path');
var node = 'desktop.bundle';

var bemtree = require(path.resolve(path.join(node, node + '.bemtree.js'))).BEMTREE;
var bemhtml = require(path.resolve(path.join(node, node + '.bemhtml.js'))).BEMHTML;

bemtree.apply({block: 'app'}).then(function (tree) {
    console.log('bemtree:');
    console.log(tree);
    console.log('bemhtml:');
    console.log(bemhtml.apply(tree));
}, function (reason) {
    console.log(reason);
});
