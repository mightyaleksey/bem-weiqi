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
 * @param  {Point} point
 * @return {Array}
 */
function adjacent(point) {
    var points = [
        [point.x() - 1, point.y()],
        [point.x() + 1, point.y()],
        [point.x(), point.y() - 1],
        [point.x(), point.y() + 1]
    ];

    points = points
        .map(function (coords) {
            return coords.map(alphabetic.bind(null, point.size())).join('');
        })
        .filter(function (coords) {
            return coords.length === 2;
        });

    return points;
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
 * Преобразует буквенную координату в числовую.
 *
 * @param  {String} x
 * @return {Number}
 */
function numeric(x) {
    return x.charCodeAt() - a;
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
 * Point
 * - pos - String
 * - x - Number
 * - y - Number
 * - size - Number
 *
 * Node
 * - is
 * - isEmpty
 * - stone
 *
 * Collection
 * - adjacent
 * - group
 * - liberties
 *
 * Board
 * - makeMove
 * - placeStone
 * - pos
 */

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
    }
});

var Node = inherit([events.Emitter, Point], {
    /**
     * @param  {Point} point
     * @return {Node}
     */
    __constructor: function (point) {
        objects.extend(this, point);
    },
    /**
     * @param  {String}  color Цвет камня.
     * @return {Boolean}
     */
    is: function (color) {
        return this._stone === color;
    },
    /**
     * @return {Boolean}
     */
    isEmpty: function () {
        return !this._stone;
    },
    /**
     * Устанавливает камень в заданную позицию.
     * Возвращает установленной значение.
     *
     * @param  {String} [color] Возможные значения: 'b'||'w'.
     * @return {String}
     */
    stone: function (color) {
        if (typeof color !== 'undefined') {
            var type = 'add';
            color === null && (type = 'remove');

            this._stone = color;

            this.emit('change', {
                type: type,
                color: color,
                pos: this.pos(),
                x: this.x(),
                y: this.y()
            });
        }

        return this._stone;
    }
});

var Collection = inherit(Array, {
    __constructor: function (nodes) {
        Array.isArray(nodes) || (nodes = [nodes]);

        nodes.forEach(function (node) {
            this.push(node);
        }, this);
    },
    /**
     * Ищет соседние камни противоположного цвета и формирует новую коллекцию из них.
     *
     * @param {Board}       board
     * @return {Collection}       Возвращает новую коллекцию.
     */
    adjacent: function (board) {
        var entities = [];

        this.forEach(function (entity) {
            if (entity instanceof Collection) {
                entities = entities.concat(entity.adjacent());

                return;
            }

            if (entity instanceof Node) {
                var color = entity.stone() === 'b' ? 'w' : 'b';

                entities = entities.concat(adjacent(entity)
                    .map(function (position) {
                        return board.pos(new Point(position, this));
                    }, entity.size()))
                    .filter(function (node) {
                        return node.is(color);
                    });

                return;
            }

            if (entity instanceof Point) {
                entities = entities.concat(adjacent(entity).map(function (position) {
                    return new Point(position, this);
                }, entity.size()));

                return;
            }

        });

        var visited = {};
        entities = entities.filter(function (entity) {
            var position = entity.pos();

            if (visited[position]) {
                return false;
            }

            return visited[position] = true;
        });

        return new Collection(entities);
    },
    /**
     * Преобразует камни в группы камней.
     *
     * @param  {Board}      board
     * @return {Collection}
     */
    group: function (board) {
        if (this.length === 1 && this[0] instanceof Node) {
            var color = this[0].stone();
            var group = [];
            var queue = [];
            var visited = {};

            queue.push(this[0]);
            visited[this[0].pos()] = true;

            while (queue.length) {
                var n = queue.pop();
                group.push(n);

                adjacent(n).forEach(function (a) {
                    a = board.pos(new Point(a, this));

                    if (visited[a.pos()]) {
                        return false;
                    }

                    visited[a.pos()] = true;
                    a.is(color) && queue.push(a);
                }, this[0].size());
            }

            group = group.sort(function (a, b) {
                if (a.pos() < b.pos()) {
                    return -1;
                }

                if (a.pos() > b.pos()) {
                    return 1;
                }

                return 0;
            });

            return new Collection(group);
        }

        if (this.length > 1) {
            var rs = [];

            this.forEach(function (node) {
                var col = new Collection(node).group(board);
                col.length && rs.push(col);
            });

            return new Collection(rs);
        }

        return [];
    },
    /**
     * Проверяет, являются ли группы живыми. Если нет, то удаляет их с доски.
     *
     * @param  {Board} board
     */
    isAlive: function (board) {
        if (this[0] instanceof Collection) {
            this.forEach(function (col) {
                col.isAlive(board);
            });

            return;
        }

        if (this[0] instanceof Node) {
            var liberties = 0;
            var visited = {};

            this.forEach(function (node) {
                adjacent(node).forEach(function (position) {
                    if (visited[position]) {
                        return false;
                    }

                    board.pos(new Point(position, this)).isEmpty() && liberties++;
                    visited[position] = true;
                }, node.size());
            });

            liberties === 0 && this.forEach(function (node) {
                node.stone(null);
            });
        }
    }
});

var Board = inherit(events.Emitter, {
    __constructor: function (size) {
        this._expectedStone = 'b';
        this._pos = {};
        this._size = size || 19;
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
        if (!this.pos(point).isEmpty()) {
            return false;
        }

        this.pos(point).stone(this._expectedStone);

        var group = new Collection(this.pos(point)).group(this);
        var adjacent = group.adjacent(this);
        adjacent.length && adjacent.group(this).isAlive(this);
        group.isAlive(this);

        this._expectedStone = this._expectedStone === 'b' ? 'w' : 'b';

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
     * @param  {String} [stone]  Цвет камня (если есть). Принимаемые значения 'b'||'w'.
     * @param  {Number} [size]   Размер доски.
     * @return {Board}
     */
    placeStone: function (point, color) {
        this.pos(point).stone(color);

        return this;
    },
    /**
     * @param  {Point} point
     * @return {Node}
     */
    pos: function (point) {
        var position = point.pos();

        if (!this._pos[position]) {
            this._pos[position] = new Node(point);
            this._pos[position].on('change', function (e, data) {
                this.emit('change', data)
            }, this);
        }

        return this._pos[position];
    }
});

provide({
    Board: Board,
    Point: Point
});

});
