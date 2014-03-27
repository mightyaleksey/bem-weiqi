modules.define('tree', ['objects', 'inherit'], function (provide, objects, inherit) {
'use strict';

var EdgeNode = inherit({
    /**
     * Создание новой вершины
     * @param  {Object} attrs Атрибуты узла (=вершины).
     * @param  {Object} [options] Дополнительные параметры. Можно указать номер вершины, вес ребра и массив следующих ребер в списке.
     * @return {EdgeNode}
     */
    __constructor: function (attrs, options) {
        options || (options = {});
        this.attrs = attrs;
        this.y = options.y;
        this.weight = options.weight || 0;
        options.next && (this.next = options.next);
    },
    /**
     * Возвращает атрибуты узла (=вершины).
     * @return {Object}
     */
    attributes: function () {
        return this.attrs;
    }
});

var Graph = inherit({
    __constructor: function () {
        this.graph = {};
        this.y = 0;
    },
    /**
     * Добавляет новую вершину в список.
     * @param {Object} attrs Атрибуты добавляемого узла (=вершины).
     * @param {Number} [edgenode] Номер другой вершины. Если указан, будет создано ребро, соединяющее эти две вершины.
     * @return {Graph}
     */
    addEdgeNode: function (attrs, edgenode) {
        var node = this.getNode(edgenode);
        var edgenode = new EdgeNode(attrs, {
            y: this.generateId(),
            weight: 1
        });

        this.linkNodes(node, edgenode);
        this.graph[edgenode.y] = edgenode;
        this.cy = this.y;

        return this;
    },
    gotoNode: function (node) {
        var startNode = this.cy;
        this.bfs(this.y, node) || (startNode = 1);
        this.cy = node;

        var startEdgeNode = this.getNode(startNode),
            goalEdgeNode = this.getNode(node),
            queue = [];

        queue.push(goalEdgeNode);
        while(goalEdgeNode !== startEdgeNode) {
            goalEdgeNode = this.getNode(goalEdgeNode.previous);
            queue.push(goalEdgeNode);
        }

        return queue.reverse();
    },
    /**
     * Поиск в ширину заданной вершины.
     * @param  {Number} start Вершина, от которой следует начать поиск
     * @param  {Number} goal  Искомая вершина
     * @return {Boolean}
     */
    bfs: function (startNode, goalNode) {
        var goalEdgeNode = this.getNode(goalNode),
            startEdgeNode = this.getNode(startNode),
            visited = {},
            queue = [];

        queue.push(startEdgeNode);
        visited[startEdgeNode.y] = true;

        while (queue.length) {
            var edgenode = queue.pop();
            if (edgenode === goalEdgeNode) {
                return true;
            }

            edgenode.next.forEach(function (child) {
                if (!visited.hasOwnProperty(child.y)) {
                    queue.push(child);
                    visited[child.y] = true;
                }
            });
        }

        return false;
    },
    /**
     * Возвращает уникальный номер для вершины.
     * @return {Number}
     */
    generateId: function () {
        return ++this.y;
    },
    /**
     * Возвращает вершину по ее номеру. В противном случае вернет последнюю добавленную.
     * @param  {Number} node
     * @return {EdgeNode}
     */
    getNode: function (node) {
        if (node instanceof EdgeNode) {
            return node;
        }
        return this.graph[node || this.cy];
    },
    /**
     * Дополняет список ребер.
     * @param  {EdgeNode} target
     * @param  {EdgeNode} source
     * @return {Graph}
     */
    linkNodes: function (target, source) {
        if (target == null) {
            return;
        }
        Array.isArray(target.next) || (target.next = []);

        for (var i = 1, lgth = arguments.length; i < lgth; i++) {
            target.next.push(arguments[i]);
            arguments[i].previous = target.y;
        }

        target.next = target.next.filter(function (e, i, arr) {
            return arr.indexOf(e) === i;
        });

        return this;
    }
});

provide(Graph);

});
