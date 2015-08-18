import {Rx} from 'cycle-react';
import Logger from './logger';
import t from 'transducers-js';

let reducersReg = {};

function registerReducer (name, reducer) {
  if (!reducersReg[name]) {
    reducersReg[name] = [];
  }
  reducersReg[name].push (reducer);
  return reducersReg;
}

function reduceFns (reducerFns, val, state) {
  if (!reducerFns) {
    return state;
  }
  return t.reduce ((newState, reducerFn) => reducerFn (newState, val),
                   state, reducerFns);
}

function makeReducer$Fn (intents, reducers) {
  return ([name, reducerFns]) => {
    // console.log (name, reducerFns);
    if (intents[name]) {
      return intents[name].map (
        val =>
          state =>
          t.comp (reduceFns.bind (null, reducers['pre-all'], [name, val]),
                  reduceFns.bind (null, reducerFns, val),
                  reduceFns.bind (null, reducers['post-all'], [name, val])) (state));
    }

    Logger.log ('Can not find intent for defined actions:', name);

    return null;
  };
}

function makeModification$ (intents) {
  let merger$ = t.into (
    [],
    t.comp (t.map (makeReducer$Fn (intents, reducersReg)),
            t.filter (val => val !== null)),
    reducersReg);

  return Rx.Observable.merge (merger$);
}

function init (intents, source) {
  let modification$ = makeModification$(intents);

  return source.concat(modification$)
    .scan((store, modFn) => modFn(store))
    .shareReplay(1);
}

module.exports = {
  init: init,
  registerReducer: registerReducer
};
