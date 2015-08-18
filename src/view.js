import React from 'react';
import App from './components/app';
import Intents from './intents';

Intents.register ('selectObjectInSelectedLayer', function (interactions) {
  return interactions.get ('selectObjectInSelectedLayer');
});

function render (state$, interactions) {
  return state$.map (
    state =>
      <App state={state.get('data')}
        onSelectObjectInLayer={interactions.listener('selectObjectInSelectedLayer')} />
  );
}

module.exports = {
  render: render
};
