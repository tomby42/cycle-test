import Model from '../model';
import Store from '../store';
import Modes from '../constants/editor-modes';

Model.registerReducer (
  'selectObjectInSelectedLayer',
  (store, [object, layer]) => {
    if (!layer.get('selected')) {
      return store;
    }

    return Store.transact (store,
                           [[['editState'], Modes.SELECT_OBJ],
                            [['selectedObjectId'], object.get ('id')]]);
  });
