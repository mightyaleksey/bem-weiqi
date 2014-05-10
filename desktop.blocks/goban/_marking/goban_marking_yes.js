modules.define('i-bem__dom',
    function (provide, dom) {
'use strict';

provide(dom.decl({
    block: 'goban',
    modName: 'marking',
    modVal: 'yes'
}, {
    /**
     * Диаметр камня
     *
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
     */
    drawGoban: function () {
        var layout = this.getLayer('board');
        var palette = this.getPalette();
        var base = this.getBase();
        var unit = this.countUnit();
        var coords = this.countCoords();

        // Рамка
        layout
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

        layout
            .font(fontSize + 'px Monospace')
            .textAlign('center')
            .fillStyle(palette.font)
            .beginPath();

        this.getLetters().split('').forEach(function (a, i) {
            a = a.toUpperCase();

            layout
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
}));

});
