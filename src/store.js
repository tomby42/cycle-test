import Immutable from 'immutable';

/* TODO: logger or stream for updates */

const START = -1;
const END = -2;

function query (store, qrys) {
  return qrys.map (function (qry) {
    return store.getIn (['data'].concat (qry), null);
  });
}

function makeTransactionRecord (store, newData, transactQrys) {
  return Immutable.Map ({
    txId: store.get ('txMaxId'),
    oldValue: store.get ('data'),
    newValue: newData,
    query: transactQrys
  });
}

function makeStore (store, data, history, fingerPos) {
  return Immutable.Map ({
    data: data,
    history: history,
    txMaxId: store.get ('txMaxId') + 1,
    fingerPos: fingerPos
  });
}

function transact (store, transactQrys, remember) {
  let newData = transactQrys.reduce (
    (data, [pth, val]) => data.setIn (pth, val), store.get ('data')),
      tx = remember ?
        makeTransactionRecord (store, newData, transactQrys)
        : null;

  return makeStore (
    store,
    newData,
    remember ?
      store.get ('history').push (tx)
      : store.get ('history'),
      END
  );
}

function update (store, txValue, posFn) {
  let history = store.get ('history'),
      [pos, newPos] = posFn (store.get ('fingerPos'), history.size),
      tx, newTx;

  if (pos === null) {
    return store;
  }

  // console.log (pos, newPos);

  tx = history.get (pos);
  newTx = makeTransactionRecord (store, tx.get (txValue), null);

  return makeStore (store, tx.get (txValue), history.push (newTx), newPos);
}

function undo (store) {
  return update (store, 'oldValue', (pos, size) => {
    return (pos === START || !size) ? [null, null]
      : (pos === END ? [size - 1, size - 2] : [pos, pos - 1]);
  });
}

function redo (store) {
  return update (store, 'newValue', (pos, size) => {
    return (pos === END || pos === size - 1 || !size) ? [null, null]
      : [pos + 1, pos + 1];
  });
}

module.exports = {
  make: function (data) {
    return Immutable.fromJS ({
      data: (data || {}),
      history: [],
      txMaxId: 0,
      fingerPos: END
    });
  },
  query: query,
  transact: transact,
  undo: undo,
  redo: redo
};
