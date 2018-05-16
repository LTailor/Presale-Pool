import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from "mobx-react";
import Store from "./stores/Store";
import PresalePoolService from "./services/presalePoolService";

const Root = (
  <Provider Stores={Store} PresalePoolService = {PresalePoolService}>
    <HashRouter>
        <App />
        </HashRouter>
  </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
