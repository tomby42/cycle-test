import Cycle from 'cycle-react';
import React from 'react';
import SvgLayer from './svg-layer';

let EditArea = Cycle.component ('EditArea', function (interactions, props) {

  let state$ = props.get ('state');

  let onMouseDown = interactions.get ('onMouseDown'),
      onMouseMove = interactions.get ('onMouseMove'),
      onMouseUp = interactions.get ('onMouseUp'),
      onSelectObjectInLayer = interactions.get ('onSelectObjectInLayer');

  let vtree$ = state$.map (
    state => {
      let dragging = state.get ('dragging');
      let svgLayers = state.get('svgLayers').
            filter(layer => !layer.get('mask'))
            .map((layer, i) =>
                 (<SvgLayer svgLayer={layer} svgObjects={state.get ('svgObjects')}
                    key={i} onSelectObjectInLayer={interactions.listener('onSelectObjectInLayer')}>
                  </SvgLayer>));

      return <svg className={dragging ? 'dragging' : 'not-dragging'}
              height={state.get('height')} width={state.get('width')}
              onMouseDown={interactions.listener('onMouseDown')}
              onMouseMove={interactions.listener('onMouseMove')}
              onMouseUp={interactions.listener('onMouseUp')}>

            <defs>
              {/* image svgLayers */}
            </defs>

            {/* image svgLayers */}
            {svgLayers}

            {/* control svgObjects */}
          </svg>;
    });

  return {
    view: vtree$,
    events: {
      onSelectObjectInLayer: onSelectObjectInLayer
    }
  };
});

module.exports = EditArea;
