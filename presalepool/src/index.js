import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from "mobx-react";
import Store from "./stores/Store";

const Root = (
  <Provider Stores={Store}>
    <HashRouter>
        <App />
        </HashRouter>
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
