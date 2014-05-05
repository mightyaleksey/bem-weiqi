modules.define('board',
    ['events', 'inherit', 'objects'],
    function (provide, events, inherit, objects) {
'use strict';

/**
 * Якорь для преобразования координат.
 *
 * @type {String}
 */
var a = 'a'.charCodeAt();

/**
 * Кэш буквенных координат, используемый функцией map.
 *
 * @type {Object}
 */
var maps = {};

/**
 * Возвращает список соседних точек.
 *
 * @param  {Board}       board      Ссылка на доску с камнями.
 * @param  {Point|Array} points
 * @param  {String}      [color]    Если указан, то отфильтрует список по цвету.
 * @param  {Boolean}     [invert]   Если указан, то будет фильтровать точки противоположного цвета.
 * @param  {Function}    [callback]
 * @return {Array}
 */
function adjacent(board, points, color, invert, callback) {
    Array.isArray(points) || (points = [points]);

    color && invert && (color = color === 'b' ? 'w' : 'b');

    var adjacent = [];
    var visited = {};

    points.forEach(function (point) {
        var applicants = [
            [point.x(), point.y() - 1],
            [point.x() + 1, point.y()],
            [point.x(), point.y() + 1],
            [point.x() - 1, point.y()]
        ];

        applicants.forEach(function (applicant) {
            applicant = applicant.map(alphabetic.bind(null, point.size())).join('');

            if (applicant.length === 2 && !visited[applicant]) {
                visited[applicant] = true;
                applicant = new Point(applicant, point.size());
                if (!color || board.pos(applicant).is(color)) {
                    adjacent.push(applicant);
                    callback && callback.call(board, applicant);
                }
            }
        });
    });

    return adjacent;
}

/**
 * Преобразует числовую координату в буквенную.
 *
 * @param  {Number} size Размер доски.
 * @param  {Number} x
 * @return {String}
 */
function alphabetic(size, x) {
    return map(size).charAt(x);
}

/**
 * Считаем, что ход совершен успешно.
 * Создает соответствующее событие и меняет цвет ожидаемого камня на следующем ходу.
 *
 * @param  {Board} board
 * @param  {Point} point
 */
function approveMove(board, point) {
    emit(board, 'add', point);
    board._last = point;
    board._color = board._color === 'b' ? 'w' : 'b';
}

/**
 * Создает событие заданного типа.
 *
 * @param  {Board}  board Ссылка на доску, которая создаст данное событие.
 * @param  {String} type  Тип события.
 * @param  {Point}  point
 */
function emit(board, type, point) {
    board.emit('change', {
        color: board.pos(point).color(),
        type: type,
        x: point.x(),
        y: point.y()
    });

    type === 'remove' && board.pos(point).free();
}

/**
 * Возвращает список камней, составляющих одну группу.
 *
 * @param  {Board} board
 * @param  {Point} point
 * @return {Array}
 */
function group(board, point) {
    var color = board.pos(point).color();
    var group = [];

    var queue = [point];
    var visited = {};
    visited[point.pos()] = true;

    while (queue.length) {
        var successor = queue.pop();
        group.push(successor);

        adjacent(board, successor, color, null, function (a) {
            if (!visited[a.pos()]) {
                queue.push(a);
                visited[a.pos()] = true;
            }
        });
    }

    return group;
}

/**
 * Проверяет, попадает ли данный ход под правило Ко.
 *
 * @param  {Board}   board
 * @param  {Point}   move     Ход игрока.
 * @param  {Point}   captured Захваченный камень.
 * @return {Boolean}
 */
function isKo(board, move, captured) {
    return board._last &&
        board._last.pos() === captured.pos() &&
        board._lastCaptured &&
        board._lastCaptured.pos() === move.pos();
}

/**
 * Подсчитывает количество степеней у указанной группы.
 * Если их 0, то группа мертва.
 *
 * @param  {Board}  board
 * @param  {Array}  points
 * @return {Number}
 */
function liberties(board, points) {
    var liberties = 0;

    adjacent(board, points, null, null, function (point) {
        this.pos(point).isEmpty() && liberties++;
    });

    return liberties;
}

/**
 * Возвращает список буквенных координат для заданного размера доски.
 *
 * @param  {Number} size Размер доски
 * @return {String}
 */
function map(size) {
    return maps[size] ||
        (maps[size] = Array.apply(null, Array(size))
            .map(function (u, i) {
                return String.fromCharCode(a + i);
            }).join(''));
}

/**
 * Преобразует буквенную координату в числовую.
 *
 * @param  {String} x
 * @return {Number}
 */
function numeric(x) {
    return x.charCodeAt() - a;
}

/**
 * Отсеивает дубли.
 *
 * @param  {Array} arr
 * @return {Array}
 */
function unique(arr) {
    var visited = {};

    return arr.filter(function (point) {
        if (visited[point.pos()]) {
            return false;
        }

        return visited[point.pos()] = true;
    });
}

/**
 * @class Point
 */
var Point = inherit({
    /**
     * @param  {String} position Позиция. Состоит из двух буквенных символов.
     * @param  {Number} [size]   Размер доски.
     * @return {Point}
     */
    __constructor: function (position, size) {
        this._pos = position;
        this._x = position.charAt(0);
        this._y = position.charAt(1);
        this._size = size || 19;
    },

    /**
     * Возвращает позицию.
     *
     * @return {String} Два символа.
     */
    pos: function () {
        return this._pos;
    },

    /**
     * Возвращает размер доски.
     *
     * @return {Number}
     */
    size: function () {
        return this._size;
    },

    /**
     * Позиция на горизонтальной оси.
     *
     * @return {Number}
     */
    x: function () {
        return numeric(this._x);
    },

    /**
     * Позиция на вертикальной оси.
     *
     * @return {Number}
     */
    y: function () {
        return numeric(this._y);
    },

    /**
     * Вернет позицию
     *
     * @return {String}
     */
    toString: function () {
        return this.pos();
    }
});

/**
 * @class Node
 */
var Node = inherit(Point, {
    /**
     * @param  {Point} point
     * @return {Node}
     */
    __constructor: function (point) {
        objects.extend(this, point);
    },

    /**
     * Устанавливает камень в заданную позицию.
     * Возвращает установленной значение.
     *
     * @param  {String}      [color] Возможные значения: 'b'||'w'.
     * @return {String|Node}
     */
    color: function (color) {
        if (typeof color !== 'undefined') {
            this._color = color;

            return this;
        }

        return this._color;
    },

    /**
     * Очищает позицию.
     *
     * @return {Node}
     */
    free: function () {
        this._color = null;

        return this;
    },

    /**
     * @param  {String}  color Цвет камня.
     * @return {Boolean}
     */
    is: function (color) {
        return this._color === color;
    },

    /**
     * @return {Boolean}
     */
    isEmpty: function () {
        return !this._color;
    }
});

/**
 * @class Board
 */
var Board = inherit(events.Emitter, {
    /**
     * @param  {Number} size
     * @return {Board}
     */
    __constructor: function (size) {
        this._board = {};
        this._color = 'b';
        this._size = size || 19;

        this._last = null;
        this._lastCaptured = null;
    },

    /**
     * Похож на действие в реальной игре,
     * то есть вы можете сделать шаг на пустом пересечении,
     * только один за ход (одному ходу соответствует один узел).
     * Вы можете захватить камни, совершив ход.
     * В большинстве случаев текущий ход подсвечивается.
     *
     * @return {Board}
     */
    makeMove: function (point) {
        var board = this;
        var color = this._color;

        if (!board.pos(point).isEmpty()) {
            return false;
        }

        board.pos(point).color(color);

        var current = group(board, point); // Группа, образованная текущим ходом

        var queue = adjacent(board, current, color, true).reduce(function (arr, opposite) {
            var adjacentGroup = group(board, opposite);

            liberties(board, adjacentGroup) === 0 &&
                (arr = arr.concat(adjacentGroup));

            return arr;
        }, []);

        queue = unique(queue); // Список камней, подлежащих удалению

        switch (queue.length) {
        case 0:
            if (liberties(board, current) !== 0) {
                approveMove(board, point);
            } else {
                board.pos(point).free();
            }

            break;

        case 1: // Проверка на Ко
            if (isKo(board, point, queue[0])) {
                board.pos(point).free();
            } else {
                approveMove(board, point);
                emit(board, 'remove', queue[0]);
                this._lastCaptured = queue[0];
            }

            break;

        default:
            queue.forEach(emit.bind(null, board, 'remove'));
            approveMove(board, point);
        }

        return this;
    },

    /**
     * Размещение камня на доске подходит для воспроизведения позиции,
     * например, установка форы, демонстрация задачи или анализ позиции
     * ("Это будет работать в такой позиции...").
     * Таким образом, можно разместить более одного камня,
     * камни разных цветов, удалить камни,
     * заменить камни на камни противоположного цвета и все это в одном узле.
     * Однако: нет возможности пленить камни, как при обычной игре.
     *
     * @return {Board}
     */
    placeStone: function (point, color) {
        this.pos(point).color(color);
        emit(this, 'add', point);

        return this;
    },

    /**
     * @param  {Point} point
     * @return {Node}
     */
    pos: function (point) {
        var position = point.pos();

        return this._board[position] ||
            (this._board[position] = new Node(point));
    }
});

provide({
    Board: Board,
    Point: Point
});

});
