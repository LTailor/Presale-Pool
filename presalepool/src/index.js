import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from "mobx-react";
import WalletStore from "./stores/WalletStore";

const Root = (
  <Provider WalletStore={WalletStore}>
    <HashRouter>
        <App />
        </HashRouter>
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
