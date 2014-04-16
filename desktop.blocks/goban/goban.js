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
            return this.frame ||
                (this.frame = (this.getBase() - this.countUnit() * 18) / 2);
        },
        /**
         * Диаметр камня
         * @private
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
            var layout = this.findBlockOn('goban', 'canvas');
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
         * Рисует камень выбранного цвета.
         * @param {Number}   x
         * @param {Number}   y
         * @param {Boolean}  [white] Будет ли это белый камень. В противном случае будет черный.
         * @return {BEM.DOM}
         */
        drawStone: function (x, y, white) {
            var layout = this.findBlockOn('stones', 'canvas');
            var coords = this.countCoords();
            var unit = this.countUnit();
            var palette = this.getPalette();

            var delta = Math.ceil(unit / 2) - 1;
            var delta2 = Math.ceil(unit / 2) - 2;

            if (white) {
                var fill = layout.createRadialGradient(coords[x] - unit / 3, coords[y] - unit / 3, 1, coords[x] - unit / 3, coords[y] - unit / 3, unit);
                fill.addColorStop(0, '#fefefe');
                fill.addColorStop(1, '#cecece');

                layout
                    .beginPath()
                    .fillStyle('#8d8d8c')
                    .arc(coords[x], coords[y], delta, 0, 2 * Math.PI)
                    .fill()
                    .fillStyle(fill)
                    .arc(coords[x], coords[y], delta2, 0, 2 * Math.PI)
                    .fill();
            } else {
                var fill = layout.createRadialGradient(coords[x] - unit / 5, coords[y] - unit / 5, 1, coords[x] - unit / 5, coords[y] - unit / 5, unit);
                fill.addColorStop(0, '#525151');
                fill.addColorStop(1, '#000000');

                layout
                    .beginPath()
                    .fillStyle('#020100')
                    .arc(coords[x], coords[y], delta, 0, 2 * Math.PI)
                    .fill()
                    .fillStyle(fill)
                    .arc(coords[x], coords[y], delta2, 0, 2 * Math.PI)
                    .fill();
            }

            return this;
        },
        /**
         * Рисует круг.
         * CR SGF алиас.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние. 0 - нет камня, 1 - черный, 2 - белый.
         * @return {BEM.DOM}
         */
        drawCircle: function (x, y, s) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var r = Math.round(this.countUnit() / 4);

            layout
                .strokeStyle(s === 1 ? '#fff' : '#000')
                .beginPath()
                .arc(coords[x] - .5, coords[y] - .5, r, 0, 2 * Math.PI)
                .stroke();

            return this;
        },
        /**
         * Рисует символ.
         * LB SGF алиас.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние.
         * @param  {String}  a Символ.
         * @return {BEM.DOM}
         */
        drawLetter: function (x, y, s, a) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var unit = this.countUnit();

            var dx = unit / 5;
            var fontSize = unit / 2;

            layout
                .font(fontSize + 'px Helvetica,Arial')
                .fillStyle(s === 1 ? '#fff' : '#000')
                .beginPath()
                .fillText(a, coords[x] - dx, coords[y] + dx);

            return this;
        },
        /**
         * Рисует крест.
         * MA SGF алиас.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние.
         * @return {BEM.DOM}
         */
        drawMark: function (x, y, s) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var unit = Math.round(this.countUnit() / 4) - .5;

            layout
                .strokeStyle(s === 1 ? '#fff' : '#000')
                .beginPath()
                .moveTo(coords[x] - unit, coords[y] - unit)
                .lineTo(coords[x] + unit, coords[y] + unit)
                .moveTo(coords[x] + unit, coords[y] - unit)
                .lineTo(coords[x] - unit, coords[y] + unit)
                .stroke();

            return this;
        },
        /**
         * Рисует метку.
         * SL SGF алиас.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние.
         * @return {BEM.DOM}
         */
        drawSlick: function (x, y, s) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var dx = Math.round(this.countUnit() / 5) - .5;

            layout
                .fillStyle('#f33')
                .beginPath()
                .fillRect(coords[x] - dx, coords[y] - dx, 2 * dx, 2 * dx);

            return this;
        },
        /**
         * Рисует квадрат.
         * SQ SGF алиас.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние.
         * @return {BEM.DOM}
         */
        drawSquare: function (x, y, s) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var dx = Math.round(this.countUnit() / 4) - .5;

            layout
                .strokeStyle(s === 1 ? '#fff' : '#000')
                .beginPath()
                .strokeRect(coords[x] - dx, coords[y] - dx, 2 * dx, 2 * dx);

            return this;
        },
        /**
         * Рисует треугольник.
         * @param  {Number}  x
         * @param  {Number}  y
         * @param  {Number}  s Описывает состояние.
         * @return {BEM.DOM}
         */
        drawTriangle: function (x, y, s) {
            var layout = this.findBlockOn('marks', 'canvas');
            var coords = this.countCoords();
            var unit = this.countUnit();

            var dy = Math.round(unit / 4) - .5;
            var dx = Math.round(unit / 5) - .5;

            layout
                .strokeStyle(s === 1 ? '#fff' : '#000')
                .beginPath()
                .moveTo(coords[x], coords[y] - dy)
                .lineTo(coords[x] - dx, coords[y] + dx)
                .lineTo(coords[x] + dx, coords[y] + dx)
                .lineTo(coords[x], coords[y] - dy)
                .stroke();

            return this;
        },
        /**
         * @param {Number} x
         * @param {Number} y
         * @param {String} layer
         * @return {BEM.DOM}
         */
        remove: function (x, y, layer) {
            var layout = this.findBlockOn(layer === 'stones' ? 'stones' : 'marks', 'canvas');
            var coords = this.countCoords();
            var dx = Math.ceil(this.countUnit() / 2) - 1;

            x = coords[x] - dx;
            y = coords[y] - dx;

            layout.clearRect(x, y, dx * 2 + 1, dx * 2 + 1);

            return this;
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
