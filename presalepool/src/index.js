import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';

const Root = (
  <HashRouter>
      <App />
  </HashRouter>
);

ReactDOM.render(Root, document.getElementById('root'));
