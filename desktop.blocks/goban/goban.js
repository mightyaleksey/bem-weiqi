modules.define('i-bem__dom', function (provide, dom) {
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
         * @private
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
         * @private
         * @return {String}
         */
        getLetters: function () {
            return 'abcdefghjklmnopqrst';
        },
        /**
         * Хэш с координатами (буквенная: цифровая)
         * @private
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
         * @private
         * @return {Number}
         */
        countFrame: function () {
            if (!this.frame) {
                this.frame = (this.getBase() - this.countUnit() * 18) / 2;
            }

            return this.frame;
        },
        /**
         * Диаметр камня
         * @private
         * @return {Number}
         */
        countUnit: function () {
            if (!this.unit) {
                this.unit = Math.round((this.getBase() - .5) / 19.5);
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
            var frame = this.countFrame();
            var unit = this.countUnit();
            var coords = this.countCoords();

            // Сетка
            goban
                .beginPath()
                .strokeStyle(palette.line);

            Object.keys(coords).forEach(function (key, i) {
                goban
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

            goban.stroke();

            // Хоси
            var w0 = Math.ceil(unit / 10),
                w1 = 2 * w0 + 1;

            var hoshi = [3, 9, 15].map(function (i) {
                return Math.round(coords[i] - w0);
            });

            goban.fillStyle(palette.line);

            hoshi.forEach(function (x) {
                hoshi.forEach(function (y) {
                    goban.fillRect(
                        x,
                        y,
                        w1,
                        w1
                    );
                });
            });
        },
        /**
         * @param {Number}  x
         * @param {Number}  y
         * @param {Boolean} [white]
         */
        drawStone: function (x, y, white) {
            var goban = this.findBlockInside('stones', 'canvas');
            var coords = this.countCoords();
            var unit = this.countUnit();
            var palette = this.getPalette();

            var delta = Math.ceil(unit / 2) - 1;
            var delta2 = Math.ceil(unit / 2) - 2;

            if (white) {
                var fill = goban.createRadialGradient(coords[x] - unit / 3, coords[y] - unit / 3, 1, coords[x] - unit / 3, coords[y] - unit / 3, unit);
                fill.addColorStop(0, '#fefefe');
                fill.addColorStop(1, '#cecece');

                goban
                    .beginPath()
                    .fillStyle('#8d8d8c')
                    .arc(coords[x], coords[y], delta, 0, 2 * Math.PI)
                    .fill()
                    .fillStyle(fill)
                    .arc(coords[x], coords[y], delta2, 0, 2 * Math.PI)
                    .fill();
            } else {
                var fill = goban.createRadialGradient(coords[x] - unit / 5, coords[y] - unit / 5, 1, coords[x] - unit / 5, coords[y] - unit / 5, unit);
                fill.addColorStop(0, '#525151');
                fill.addColorStop(1, '#000000');

                goban
                    .beginPath()
                    .fillStyle('#020100')
                    .arc(coords[x], coords[y], delta, 0, 2 * Math.PI)
                    .fill()
                    .fillStyle(fill)
                    .arc(coords[x], coords[y], delta2, 0, 2 * Math.PI)
                    .fill();
            }
        },
        /**
         * @param {Number} x
         * @param {Number} y
         */
        removeStone: function (x, y) {
            var goban = this.findBlockInside('stones', 'canvas');
            var coords = this.countCoords();
            var unit = this.countUnit();

            var delta = Math.ceil(unit / 2) - 1;
            x = coords[x] - delta;
            y = coords[y] - delta;

            goban.clearRect(x, y, delta * 2 + 1, delta * 2 + 1);
        },
        /**
         * Возвращает хеш с цветами
         * Доопределяется в модификаторе theme
         * @private
         * @return {Object}
         */
        getPalette: function () {}
    });

    provide(dom);
});
