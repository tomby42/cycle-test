import Cycle from 'cycle-react';
import React from 'react';

// CSS
require('../styles/ImageSidebar.less');

let SideBar = Cycle.component ('SideBar', function (interactions, props) {

  let state$ = props.get ('state');

  let vtree$ = state$.map (
    (/*state*/) => (
        <div className='ImageSidebar'>
          <h1>SVG Image Editor</h1>
        </div>));

  return {
    view: vtree$
  };
});

module.exports = SideBar;
