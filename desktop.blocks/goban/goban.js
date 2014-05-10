modules.define('i-bem__dom',
    function (provide, dom) {
'use strict';

dom.decl('goban', {
    onSetMod: {
        js: {
            inited: function () {
                this.drawGoban();
            }
        }
    },

    /**
     * Максимальная длина доски
     * Вычисляется из ширины / высоты исходного тега
     *
     * @return {Number}
     */
    getBase: function () {
        if (!this.base) {
            var $this = this.domElem;
            this.base = Math.min($this.outerWidth(), $this.outerHeight());
        }

        return this.base;
    },

    /**
     * Буквенный набор, используемый для разметки
     *
     * @return {String}
     */
    getLetters: function () {
        return 'abcdefghjklmnopqrst';
    },

    /**
     * Хэш с координатами (буквенная: цифровая)
     *
     * @return {Object}
     */
    countCoords: function () {
        if (!this.coords) {
            var coords = {},
                unit = this.countUnit(),
                frame = this.countFrame();

            this.coords = this.getLetters().split('')
                .map(function (a, i) {
                    return Math.round(unit * i + frame);
                });
        }

        return this.coords;
    },

    /**
     * Величина отступа от края до сетки
     *
     * @return {Number}
     */
    countFrame: function () {
        return this.frame ||
            (this.frame = (this.getBase() - this.countUnit() * 18) / 2);
    },

    /**
     * Диаметр камня
     *
     * @return {Number}
     */
    countUnit: function () {
        return this.unit ||
            (this.unit = Math.round((this.getBase() - .5) / 19.5));
    },

    /**
     * Разлиновывает доску.
     * @return {BEM.DOM}
     */
    drawGoban: function () {
        var layout = this.getLayer('board');
        var palette = this.getPalette();
        var base = this.getBase();
        var frame = this.countFrame();
        var unit = this.countUnit();
        var coords = this.countCoords();

        // Сетка
        layout
            .beginPath()
            .strokeStyle(palette.line);

        Object.keys(coords).forEach(function (key, i) {
            layout
                .moveTo(
                    frame + .5,
                    coords[key] + .5
                )
                .lineTo(
                    base - frame + .5,
                    coords[key] + .5
                )
                .moveTo(
                    coords[key] + .5,
                    frame + .5
                )
                .lineTo(
                    coords[key] + .5,
                    base - frame + .5
                );
        });

        layout.stroke();

        // Хоси
        var w0 = Math.ceil(unit / 10),
            w1 = 2 * w0 + 1;

        var hoshi = [3, 9, 15].map(function (i) {
            return Math.round(coords[i] - w0);
        });

        layout.fillStyle(palette.line);

        hoshi.forEach(function (x) {
            hoshi.forEach(function (y) {
                layout.fillRect(
                    x,
                    y,
                    w1,
                    w1
                );
            });
        });
    },

    /**
     * Возвращает ссылку на слой канвас.
     *
     * @param  {String}     layer
     * @return {dom.canvas}
     */
    getLayer: function (layer) {
        return this.findBlockOn(layer, 'canvas');
    },

    /**
     * Возвращает хеш с цветами
     * Доопределяется в модификаторе theme
     *
     * @return {Object}
     */
    getPalette: function () {}
});

provide(dom);

});
