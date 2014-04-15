modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    dom.decl('example', {
        onSetMod: {
            js: {
                inited: function () {
                    this.findBlockInside('goban')
                        .drawStone(3, 3, false)
                        .drawStone(5, 2, true)
                        .drawStone(5, 3, false)
                        .drawStone(6, 3, true)
                        .drawStone(5, 4, false)
                        .drawStone(4, 2, true)
                        .drawStone(3, 2, false)
                        .drawStone(9, 2, true)
                        .drawStone(2, 9, false)
                        .drawCircle(3, 3, 1)
                        .drawCircle(5, 2, 2)
                        .drawSquare(5, 3, 1)
                        .drawSquare(6, 3, 2)
                        .drawMark(5, 4, 1)
                        .drawMark(4, 2, 2)
                        .drawTriangle(3, 2, 1)
                        .drawTriangle(9, 2, 2)
                        .drawSlick(2, 9);

                    this.findBlockInside('goban')
                        .drawStone(16, 16, false)
                        .drawStone(15, 15, true)
                        .drawStone(16, 15, false)
                        .drawStone(15, 14, true)
                        .drawStone(14, 17, false)
                        .drawStone(12, 15, true)
                        .drawStone(17, 13, false)
                        .drawStone(15, 11, true)
                        .drawLetter(16, 16, 1, 1)
                        .drawLetter(15, 15, 2, 2)
                        .drawLetter(16, 15, 1, 3)
                        .drawLetter(15, 14, 2, 4)
                        .drawLetter(14, 17, 1, 5)
                        .drawLetter(12, 15, 2, 6)
                        .drawLetter(17, 13, 1, 7)
                        .drawLetter(15, 11, 2, 8);
                }
            }
        }
    });

    provide(dom);
});
