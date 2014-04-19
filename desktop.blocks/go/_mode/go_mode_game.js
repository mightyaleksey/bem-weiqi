modules.define('i-bem__dom', ['board'], function (provide, board, dom) {
    'use strict';

    dom.decl({
        block: 'go',
        modName: 'mode',
        modVal: 'game'
    }, {
        onSetMod: {
            js: {
                inited: function () {
                    this.__base.apply(this, arguments);

                    this.board = new board.Board(19);
                    this.board.on('add', this.handleBoardEvent, this);
                    this.board.on('remove', this.handleBoardEvent, this);
                }
            }
        },

        handleBoardEvent: function (e, d) {
            switch(e.type) {
            case 'add':
                this.getGoban().drawStone(d.x, d.y, d.color === 2);
                break;
            case 'remove':
                this.getGoban().remove(d.x, d.y, 'stones');
                break;
            }
        }
    }, {
        live: function () {
            this.__base.apply(this, arguments);

            this.liveBindTo('click', function (e) {
                var x = Math.round((e.offsetX - this.getGoban().countFrame()) / this.getGoban().countUnit());
                var y = Math.round((e.offsetY - this.getGoban().countFrame()) / this.getGoban().countUnit());

                if (x > -1 && x < 19 && y > -1 && y < 19) {
                    var base = 'a'.charCodeAt(0);

                    x = String.fromCharCode(x + base);
                    y = String.fromCharCode(y + base);

                    this.board.makeMove(x + y);
                }
            });
        }
    });

    provide(dom);
});
