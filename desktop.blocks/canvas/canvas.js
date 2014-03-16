modules.define('i-bem__dom', function (provide, dom) {
    'use strict';

    /**
     * Методы экземпляра блока
     */
    var copy = {
        onSetMod: {
            js: {
                inited: function () {
                    var canvas = this.canvas = this.domElem.context;
                    this.ctx = canvas.getContext('2d');

                    var $canvas = this.domElem;
                    $canvas.prop({
                        width: $canvas.outerWidth(),
                        height: $canvas.outerHeight()
                    });
                }
            }
        },

        setData: function (data) {
            var _this = this;
            var image = new Image();

            image.onload = function () {
                _this.drawImage(image, 0, 0);
            }

            image.src = data;
        },

        toDataURL: function () {
            var canvas = this.canvas;
            return canvas.toDataURL.apply(canvas, arguments);
        }
    };

    /**
     * Список проксируемых методов и свойств канваса
     */
    var canvasMethods = [
        'arc','arcTo',
        'beginPath','bezierCurveTo',
        'clearRect','clip','closePath',
        'drawImage',
        'fill','fillRect','fillText',
        'lineTo',
        'moveTo',
        'quadraticCurveTo',
        'rect','restore','rotate',
        'save','scale','setTransform','stroke','strokeRect','strokeText',
        'transform','translate'
    ];

    var canvasGetterMethods = [
        'createImageData','createLinearGradient','createRadialGradient','createPattern',
        'drawFocusRing',
        'getImageData',
        'isPointInPath',
        'measureText',
        'putImageData'
    ];

    var canvasProps = [
        'canvas',
        'fillStyle',
        'font',
        'globalAlpha','globalCompositeOperation',
        'lineCap','lineJoin','lineWidth',
        'miterLimit',
        'shadowOffsetX','shadowOffsetY','shadowBlur','shadowColor','strokeStyle',
        'textAlign','textBaseline'
    ];

    canvasMethods.forEach(function (m) {
        copy[m] = (function (m) {
            return function () {
                this.ctx[m].apply(this.ctx, arguments);
                return this;
            }
        })(m);
    });

    canvasGetterMethods.forEach(function (m) {
        copy[m] = (function (m) {
            return function () {
                return this.ctx[m].apply(this.ctx, arguments);
            };
        })(m);
    });

    canvasProps.forEach(function (p) {
        copy[p] = (function (p) {
            return function (value) {
                if (typeof value === 'undefined') {
                    return this.ctx[p];
                }

                this.ctx[p] = value;
                return this;
            }
        })(p);
    });

    provide(dom.decl('canvas', copy, {live: true}));
});
