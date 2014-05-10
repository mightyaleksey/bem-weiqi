modules.define('sgf', ['tree'],
    function (provide) {
'use strict';

/**
 * Преобразует SGF строку в логическую структуру.
 *
 * @param  {String} sgf
 * @param  {Tree}   [tree]
 * @return {Tree}
 */
function decode(sgf, tree) {
    return tree;
}

/**
 * Преобразует логическую структуру в строку в SGF формате.
 *
 * @param  {Tree}   tree
 * @return {String}
 */
function encode(tree) {
    return sgf;
}

provide({
    decode: decode,
    encode: encode
});

});
