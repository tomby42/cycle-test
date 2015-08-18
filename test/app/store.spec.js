import * as Immutable from 'immutable';
import * as Store from '../../src/store';

jasmineCheck.install();

describe ('make new store', function () {
  it ('should be empty', function () {
    let s = Store.make ();
    expect (s.get('data').isEmpty ()).toBe (true);
    expect (s.get('history').isEmpty ()).toBe (true);
    expect (s.get('txMaxId')).toBe (0);
    expect (s.get('fingerPos')).toBe (-2);
  });

  if ('should contains data', function () {
    let data = Immutable.Map ({a: 1});
    let s = Store.make (data);

    expect (s.get('data').equals (data)).toBe (true);
    expect (s.get('history').isEmpty ()).toBe (true);
    expect (s.get('txMaxId')).toBe (0);
    expect (s.get('fingerPos')).toBe (-2);
  });
});

describe ('query', function () {
  let s = Store.make ({a: 1, b: {c: 2, d: [3, 4]}});

  it ('should return 1', function () {
    expect (Store.query (s, [['a']])).toEqual ([1]);
  });

  it ('should return 1 and 2', function () {
    expect (Store.query (s, [['a'], ['b', 'c']])).toEqual ([1, 2]);
  });

  it ('should return null', function () {
    expect (Store.query (s, [['h']])).toEqual ([null]);
  });

  it ('should return 3', function () {
    expect (Store.query (s, [['b', 'd', 0]])).toEqual ([3]);
  });
});

describe ('transact', function () {
  let s = Store.make ();

  it ('should not be empty', function () {
    let ns = Store.transact (s, [[['a'], 1]]);

    expect (Store.query (ns, [['a']])).toEqual ([1]);
    expect (ns.get ('history').isEmpty ()).toBe (true);
  });

  it ('should not be empty with history', function () {
    let ns = Store.transact (s, [[['a'], 1]], true),
        h = ns.get ('history');

    expect (Store.query (ns, [['a']])).toEqual ([1]);
    expect (h.isEmpty ()).toBe (false);
    expect (ns.get ('txMaxId')).toBe (1);
    expect (h.getIn ([0, 'txId'])).toBe (0);
    expect (h.getIn ([0, 'oldValue'])).toEqual (s.get('data'));
    expect (h.getIn ([0, 'newValue'])).toEqual (ns.get('data'));
    expect (h.getIn ([0, 'query'])).toEqual ([[['a'], 1]]);
  });
});

describe ('undo', function () {
  let s = Store.make (),
      s1 = Store.transact (s, [[['a'], 1]], true),
      s2 = Store.transact (s1, [[['b'], 2]], true),
      s3 = Store.transact (s2, [[['c', 'd'], 3]], true);

  it ('should not be empty', function () {
    let ns = Store.undo (Store.undo (s3));

    expect (ns.get ('data').isEmpty ()).toBe (false);
    expect (ns.get ('fingerPos')).toBe (0);
    expect (Store.query (ns, [['a']])).toEqual ([1]);
    expect (ns.get ('data')).toEqual (s1.get('data'));
  });

  it ('should be empty', function () {
    let ns = Store.undo (Store.undo (Store.undo (s3)));

    expect (ns.get ('data').isEmpty ()).toBe (true);
    expect (ns.get ('fingerPos')).toBe (-1);
    expect (ns.get ('data')).toEqual (s.get('data'));
    expect (ns.get ('history').size).toBe (6);
  });

  it ('should be empty with noop', function () {
    let ns = Store.undo (Store.undo (Store.undo (Store.undo (s3))));

    expect (ns.get ('data').isEmpty ()).toBe (true);
    expect (ns.get ('fingerPos')).toBe (-1);
    expect (ns.get ('data')).toEqual (s.get('data'));
    expect (ns.get ('history').size).toBe (6);
  });
});

describe ('redo', function () {
  let s = Store.make (),
      s1 = Store.transact (s, [[['a'], 1]], true),
      s2 = Store.transact (s1, [[['b'], 2]], true),
      s3 = Store.transact (s2, [[['c', 'd'], 3]], true);

  it ('should be s1', function () {
    let ss = Store.undo (Store.undo (Store.undo (s3))),
        ns = Store.redo (ss);

    expect (ns.get ('data')).toEqual (s1.get('data'));
    expect (ns.get ('history').size).toBe (7);
  });

  it ('should be s3', function () {
    let ss = Store.undo (Store.undo (Store.undo (s3))),
        ns = Store.redo (Store.redo(Store.redo (ss)));

    expect (ns.get ('data')).toEqual (s3.get('data'));
    expect (ns.get ('history').size).toBe (9);
  });

  it ('should be s3 noop', function () {
    let ns = Store.redo (s3);

    expect (ns.get ('data')).toEqual (s3.get('data'));
  });
});
