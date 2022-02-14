import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import reducers from '../redux/reducers';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: [
        'productReducer',
        'systemReducer',
        'voucherReducer'
    ],
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
    let store = createStore(persistedReducer, {}, applyMiddleware(thunk));
    let persistor = persistStore(store);
    return { store, persistor };
};