import Cycle from 'cycle-react';
import React from 'react';
import SvgObject from './svg-object';

// CSS
require('../styles/SvgLayer.less');

let SvgLayer = Cycle.component ('SvgLayer', function (interactions, props) {

  let svgLayer$ = props.get ('svgLayer').shareReplay(1),
      svgObject$ = props.get ('svgObjects');

  let onSelectObjectInLayer = interactions.get ('onSelectObjectInLayer');

  let vtree$ = Cycle.Rx.Observable.combineLatest (
    svgLayer$, svgObject$,
    (svgLayer, svgObjects) => {
      var svgLayerClass = 'SvgLayer';
      if (svgLayer.get('visible')) {
        svgLayerClass += ' showLayer';
      } else {
        svgLayerClass += ' hideLayer';
      }

      if (svgLayer.get('preSelected')) {
        svgLayerClass += ' preSelected';
      }

      var layerObjects = svgLayer.get('svgObjects');
      return <g className={svgLayerClass}>
        {
          layerObjects.map(
            (objectID, i) =>
              (<SvgObject key={i} object={svgObjects.get (objectID)}
                 onSelectObject={interactions.listener('onSelectObjectInLayer')}>
               </SvgObject>))
        }
      </g>;
    }
  );

  return {
    view: vtree$,
    events: {
      onSelectObjectInLayer: onSelectObjectInLayer.
        withLatestFrom (svgLayer$, (object, layer) => [object, layer])
    }
  };
});

module.exports = SvgLayer;
