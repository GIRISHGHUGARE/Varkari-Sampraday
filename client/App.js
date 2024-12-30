import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native'
import store from './src/redux/store.js';
import Tab from './src/navigation/Tab.js';
import "./global.css"

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab />
      </NavigationContainer>
    </Provider>
  );
}
