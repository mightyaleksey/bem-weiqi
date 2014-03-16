/**
 * Небольшой скрипт для проверки собранного bemtree таргета
 */
var path = require('path');
var node = 'desktop.bundle';

var bemtreePath = path.resolve(path.join(node, node + '.bemtree.js'));
var bemtree = require(bemtreePath).BEMTREE;

bemtree.apply({block: 'app'}).then(function (tree) {
    console.log(tree);
}, function (reason) {
    console.log(reason);
});
