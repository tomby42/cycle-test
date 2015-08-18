// Load in SVGDOMPropertyConfig before loading React ever and set up custom properties
var SVGDOMPropertyConfig = require('react/lib/SVGDOMPropertyConfig');
var DOMProperty = require('react/lib/DOMProperty');

SVGDOMPropertyConfig.DOMAttributeNames.mask = 'mask';
SVGDOMPropertyConfig.Properties.mask = DOMProperty.injection.MUST_USE_ATTRIBUTE;

import Cycle from 'cycle-react';
import Intents from './intents';
import Model from './model';
import View from './view';
import Source from './drivers/source';

require ('./state-reducers/index');

function app(interactions) {
  let intent$ = Intents.init (interactions);
  let state$ = Model.init(intent$, Source());
  return View.render(state$, interactions);
}

Cycle.applyToDOM(document.body, app);
