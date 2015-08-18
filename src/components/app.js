import Cycle from 'cycle-react';
import React from 'react';
import SideBar from './side-bar';
import EditArea from './edit-area';

// CSS
require('bootstrap/dist/css/bootstrap.min.css');
require('normalize.css');
require('../styles/main.less');

let App = Cycle.component ('App', function (interactions, props) {

  let state$ = props.get ('state');

  let onSelectObjectInLayer = interactions.get ('onSelectObjectInLayer');

  let vtree$ = state$.map (
    state =>
      <div className='main'>
        <div className='image-editor'>
          <SideBar state={state} />
          <div className='image-preview'>
            <EditArea state={state} onSelectObjectInLayer={interactions.listener('onSelectObjectInLayer')}/>
          </div>
        </div>
      </div>
  );


  return {
    view: vtree$,
    events: {
      onSelectObjectInLayer: onSelectObjectInLayer
    }
  };
});

module.exports = App;
