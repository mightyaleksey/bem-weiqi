modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    dom.decl({
        block: 'goban',
        modName: 'marking',
        modVal: 'yes'
    }, {
        /**
         * Диаметр камня
         * @private
         * @return {Number}
         */
        countUnit: function () {
            if (!this.unit) {
                this.unit = Math.round((this.getBase() - .5) / 21.5);
            }

            return this.unit;
        },
        /**
         * Разлиновывает доску
         * @private
         */
        drawGoban: function () {
            var goban = this.findBlockInside('goban', 'canvas');
            var palette = this.getPalette();
            var base = this.getBase();
            var unit = this.countUnit();
            var coords = this.countCoords();

            // Рамка
            goban
                .beginPath()
                .fillStyle(palette.dark)
                .fillRect(
                    0,
                    0,
                    base,
                    base
                )
                .fillStyle(palette.light)
                .fillRect(
                    unit,
                    unit,
                    base - 2 * unit,
                    base - 2 * unit
                );

            // Разметка
            var fontSize = Math.round(unit / 2);

            goban
                .font(fontSize + 'px Helvetica,Arial')
                .textAlign('center')
                .fillStyle(palette.font)
                .beginPath();

            this.getLetters().split('').forEach(function (a, i) {
                a = a.toUpperCase();

                goban
                    .fillText(
                        19 - i,
                        fontSize,
                        coords[i] + fontSize / 2
                    )
                    .fillText(
                        19 - i,
                        base - fontSize,
                        coords[i] + fontSize / 2
                    )
                    .fillText(
                        a,
                        coords[i],
                        fontSize * 1.5
                    )
                    .fillText(
                        a,
                        coords[i],
                        base - fontSize / 2
                    );
            });

            this.__base.apply(this, arguments);
        }
    });

    provide(dom);
});
