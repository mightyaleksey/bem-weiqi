modules.define('board',
    ['inherit', 'events', 'objects'],
    function (provide, inherit, events, objects) {
'use strict';

/**
 * Методы, меняющие данные
 *
 * makeMove
 * makePass
 *
 */

/**
 * Методы для перемещения по узлам
 *
 * moveNext
 * movePrevious
 * moveTo
 *
 * Методы moveNext и movePrevious осуществляют перемещение
 * по какому-то дефолтному бранчику.
 * Переключение бранчиков будет выполняться автоматически
 * при использовании метода moveTo или редактировании
 *
 */

var BLACK_STONE = 1,
    WHITE_STONE = 2;

/**
 * Хелпер для работы с точками.
 */
var Point = inherit({
    /**
     * @param  {String} position Буквенная позиция, например, 'ab'.
     * @param  {Number} size     Размер доски. По умолчанию считает 19.
     * @return {Point}
     */
    __constructor: function (position, size) {
        this.x = position.charAt(0);
        this.y = position.charAt(1);
        this.size = size || 19;
    },
    /**
     * Возвращает список смежных точек.
     * @return {Array} Список точек.
     */
    adjacent: function () {
        var points = [];

        this.next(this.x) && points.push(new Point(this.next(this.x) + this.y, this.size));
        this.next(this.y) && points.push(new Point(this.x + this.next(this.y), this.size));
        this.previous(this.x) && points.push(new Point(this.previous(this.x) + this.y, this.size));
        this.previous(this.y) && points.push(new Point(this.x + this.previous(this.y), this.size));

        return points;
    },
    /**
     * Возвращает список буквенных координат для доски заданного размера.
     * @return {String} Строка с координатами.
     */
    getMap: function () {
        return this.map ||
            (this.map = Array.apply(null, Array(this.size))
                .map(function (u, i) {
                    return String.fromCharCode(this + i);
                }, 'a'.charCodeAt(0)).join(''));
    },
    /**
     * Проверяет, является ли указанная позиция начальной на оси.
     * @param  {String}  x Позиция на одной из координатных осей.
     * @return {Boolean}
     */
    isFirst: function (x) {
        return x === this.getMap().charAt(0);
    },
    /**
     * Проверяет, является ли указанная позиция конечной на оси.
     * @param  {String}  x Позиция на одной из координатных осей.
     * @return {Boolean}
     */
    isLast: function (x) {
        var map = this.getMap();
        return x === map.charAt(map.length - 1);
    },
    /**
     * Возвращает следующую на оси позицию.
     * @param  {String} x Исходная позиция.
     * @return {String}
     */
    next: function (x) {
        var map = this.getMap();
        var index = map.indexOf(x);
        return index > -1 ? map.charAt(index + 1) : '';
    },
    /**
     * Возвращает предшествующую на оси позицию.
     * @param  {String} x Исходная позиция.
     * @return {String}
     */
    previous: function (x) {
        var map = this.getMap();
        return map.charAt(map.indexOf(x) - 1);
    },
    toString: function () {
        return this.x + this.y;
    }
});

var Board = inherit(events.Emitter, {
    /**
     * @param  {Number} size Размер доски
     * @return {Board}
     */
    __constructor: function (size) {
        // Описывает текущую позицию.
        this.board = {};
        // Очередность хода.
        this.blackMove = true;
        // Количество захваченных камней.
        this.captured = {
            black: 0,
            white: 0
        };
        // Размер доски.
        this.size = size;
    },
    /**
     * Добавляет камень по заданным координатам на доску.
     * Проводит ряд проверок на убийство группы, ко и суицид.
     * @param  {String} position Координаты
     */
    makeMove: function (point) {
        point = new Point(point, this.size);
        if (this.board.hasOwnProperty(point.toString())) {
            return;
        }

        this.board[point.toString()] = this.blackMove ?
            BLACK_STONE :
            WHITE_STONE;

        // Список соседних точек.
        var adjacent = this.getGroup(point)
            .reduce(function (arr, point) {
                return arr.concat(point.adjacent());
            }, []);

        // Фильтруем дубликаты, а также точки, цвет которых соответствует исходной.
        // Добавляем исходную в конец для проверки (на суицид).
        this.filter(adjacent, this.board[point.toString()]).concat(point)
            .forEach(function (p) {
                var group = this.getGroup(p);
                this.countLiberties(group) === 0 && this.removeGroup(group);
            }, this);

        if (this.board.hasOwnProperty(point.toString())) {
            var attrs = {};
            attrs[this.blackMove ? 'b' : 'w'] = point.toString();

            this.emit('add', {
                color: this.board[point.toString()],
                point: point.toString(),
                x: point.getMap().indexOf(point.x),
                y: point.getMap().indexOf(point.y)
            });
        }

        this.blackMove = !this.blackMove;
    },
    /**
     * Игрок делает пасс. Два пасса подряд приводит к окончанию партии.
     */
    makePass: function () {
        var attrs = {};
        attrs[this.blackMove ? 'b' : 'w'] = '';

        this.blackMove = !this.blackMove;
    },
    moveNext: function () {},
    movePrevious: function () {},
    moveTo: function (x) {
        this.emit('clear');
    },
    /**
     * Считает количество степеней свободы указанной группы.
     * @param  {Array}  group Исходная группа.
     * @return {Number}       Количество степеней.
     */
    countLiberties: function (group) {
        var liberties = 0;
        var visited = {};

        group.length && group.forEach(function (point) {
            point.adjacent().forEach(function (a) {
                if (!this.board.hasOwnProperty(a.toString()) &&
                        !visited[a.toString()]) {
                    visited[a.toString()] = true;
                    liberties++;
                }
            }, this);
        }, this);

        return liberties;
    },
    /**
     * Отсеивает дубли, а также фильтрует камни по цвету.
     * @param  {Array}  points Исходный массив.
     * @param  {String} color  Фильтруемый цвет.
     * @return {Array}
     */
    filter: function (points, color) {
        var checked = {};
        return points.filter(function (point) {
            if (checked[point.y] || this.board[point.toString()] === color) {
                return false;
            }

            checked[point.y] = point;
            return true;
        }, this);
    },
    /**
     * Формирует список камней,
     * составляющие целую группу вместе с исходной точкой.
     * @param  {Point} point Исходная точка.
     * @return {Array}       Список точек.
     */
    getGroup: function (point) {
        var group = [];

        if (this.board.hasOwnProperty(point.toString())) {
            var color = this.board[point.toString()];
            var queue = [];
            var visited = {};

            queue.push(point);
            visited[point.toString()] = true;

            while (queue.length) {
                var p = queue.pop();
                this.board[p.toString()] === color && group.push(p);

                p.adjacent().forEach(function (a) {
                    if (this.board[a.toString()] === color &&
                            !visited[a.toString()]) {
                        queue.push(a);
                        visited[a.toString()] = true;
                    }
                }, this);
            }
        }

        return group;
    },
    /**
     * Удаляет список точек с доски.
     * @param  {Array} group Список точек.
     */
    removeGroup: function (group) {
        group.forEach(function (point) {
            this.emit('remove', {
                color: this.board[point.toString()],
                point: point.toString(),
                x: point.getMap().indexOf(point.x),
                y: point.getMap().indexOf(point.y)
            }, this);

            var player = this.board[point.toString()] === BLACK_STONE ?
                'black' :
                'white';
            this.captured[player]++;

            delete this.board[point.toString()];
        }, this);
    }
});

provide({
    Board: Board,
    Point: Point
});

});
