import Intents from '../../src/intents';
import {Rx} from 'cycle-react';

jasmineCheck.install();

describe ('register and init', function () {
  Intents.register ('a', function (i) {
    return new Rx.Subject ();
  });
  
  Intents.register ('b', function (i) {
    return new Rx.Subject ();
  });

  let intents = Intents.init ();

  it ('should init intents', function () {
    expect (intents.a).toBeDefined ();
    expect (intents.b).toBeDefined ();
  });

  it ('should contains observable', function (done) {
    intents.a.subscribe (function (val) {
      expect (val === 42).toBe (true);
      done ();
    });
    
    intents.a.onNext (42);
  });
});
