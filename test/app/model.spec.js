import Model from '../../src/model';
import * as Store from '../../src/store';
import {Rx} from 'cycle-react';

let source = Rx.Observable.just(Store.make ({}));

describe ('', function () {
  let intents = {
    a: new Rx.Subject (),
    b: new Rx.Subject ()
  };

  Model.registerAction ('a', function (store, val) {
    return Store.transact (store, [[['a'], val]]);
  });

  Model.registerAction ('b', function (store, val) {
    let v = Store.query (store, [['a']]);

    switch (val) {
      case 'inc': 
      return Store.transact (store, [[['a'], v[0] + 1]]);
      case 'dec':
      return Store.transact (store, [[['a'], v[0] - 1]]);
    }
    return store;
  });

  let state$ = Model.init (intents, source);
  let cnt = 0;
  
  it ('should set a stete according send actions', function (done) {
    let d = state$.subscribe (function (store) {
      switch (cnt) {
      case 1:
        expect (Store.query (store, [['a']])).toEqual ([1]);
        break;
      case 2:
        expect (Store.query (store, [['a']])).toEqual ([2]);
        break;
      case 3:
        expect (Store.query (store, [['a']])).toEqual ([1]);
        done ();
        break;
      }
      cnt ++;
    });

    intents.a.onNext (1);
    intents.b.onNext ('inc');
    intents.b.onNext ('dec');
  });  
});
