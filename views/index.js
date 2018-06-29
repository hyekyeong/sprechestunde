import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";

import Root from './src/Root.js';
import styles from './scss/styles.scss';

import configureStore from './configureStore';

const history = createBrowserHistory();
const store = configureStore(history);

const rootElement = document.getElementById('root');
const userId = document.getElementById('root').innerText;

ReactDOM.render(
  <Root userId={userId} history={history} store={store} />,
  rootElement 
);