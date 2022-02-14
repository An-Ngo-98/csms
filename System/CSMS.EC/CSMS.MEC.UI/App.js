import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import Menu from './navigation/Menu';
import persist from './configs/store';

const persistStore = persist();

export default function App() {
  return (
    <Provider store={persistStore.store}>
      <PersistGate loading={null} persistor={persistStore.persistor}>
          <Menu />
      </PersistGate>
    </Provider>
  );
}
