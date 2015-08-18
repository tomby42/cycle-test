import {Rx} from 'cycle-react';
import {make} from '..//store';
import Modes from '../constants/editor-modes';

module.exports = function () {
  let initialData = make ({
    /**
     * width of svg image
     * @type {Number}
     */
    width: 800,

    /**
     * height of svg image
     * @type {Number}
     */
    height: 600,

    /**
     * svg image editing state
     * @type {Number}
     */
    editState: Modes.SELECT_OBJ,

    /**
     * svg image editing state data
     * in some state
     * @type {Number}
     */
    editStateData: null,

    dragging: false,

    /**
     * SVG layers, each layer is a group of svg objects (rectangles or texts)
     * @type {Object}
     */
    svgObjects: {
      rect1: { id: 'rect1', type: 'rect', transformation: { scale: 1, x: 200, y: 200, r: 10}, size: {width: 220, height: 250 }, fill: 'green' },
      photo1: { id: 'photo1', type: 'photo', transformation: { scale: 1, x: 340, y: 100, r: 0}, size: {width: 50, height: 50 }, src: require('../images/photos/schoolgirl.jpg') },
      rect2: { id: 'rect2', type: 'rect', transformation: { scale: 1, x: 220, y: 220, r: 10}, size: {width: 250, height: 200 }, fill: 'blue' },
      rect3: { id: 'rect3', type: 'rect', transformation: { scale: 1, x: 220, y: 220, r: 10}, size: {width: 250, height: 200 }, fill: 'white' },
      rect4: { id: 'rect4', type: 'rect', transformation: { scale: 1, x: 220, y: 220, r: 100}, size: {width: 100, height: 100 }, fill: 'black' },
      polygon1: { id: 'polygon1', type: 'polygon',
                  transformation: { scale: 1, x: 500, y: 300, r: -15}, size: {width: 148, height: 114 }, fill: 'magenta',
                  polygon: [{cmd: 'M', x: -16, y: -55}, {cmd: 'L', x: 42, y: -57}, {cmd: 'L', x: 74, y: -26}, {cmd: 'L', x: 44, y: 42}, {cmd: 'L', x: -27, y: 57}, {cmd: 'L', x: -74, y: -12}]
    },
      polygon2: { id: 'polygon2', type: 'polygon',
                  transformation: { scale: 1, x: 584, y: 102, r: -15}, size: {width: 133, height: 112 }, fill: 'purple',
                  polygon: [{cmd: 'M', x: -16, y: -55}, {cmd: 'C', x1: 94, y1: -129, x2: 127, y2: 134, x: 59, y: 41}, {cmd: 'L', x: -27, y: 57}, {cmd: 'L', x: -74, y: -12}]
              }
    },

    /**
     * SVG layers, each layer is a group of svg objects (rectangles or texts)
     * @type {Object}
     */
    svgLayers: [
      {
        /**
         * name of layer (and it's id)
         * @type {string}
         */
        name: 'Layer1',
        /**
         * should be layer shown or hided
         * @type {boolean}
         */
        visible: true,
        /**
         * list of svg object belongs to layer
         * @type {list}
         */
        svgObjects: [ 'rect1', 'photo1', 'polygon1', 'polygon2'],
        selected: true
      },
      {
        name: 'Layer2',
        visible: true,
        maskAdded: 'Layer3mask',
        svgObjects: ['rect2']
      },
      {
        name: 'Layer3',
        visible: false,
        svgObjects: ['rect3', 'rect4']
      },
      {
        name: 'Layer3mask',
        visible: true,
        mask: true,
        svgObjects: ['rect3', 'rect4']
      }
    ]
  });

  return Rx.Observable.just(initialData);
};
