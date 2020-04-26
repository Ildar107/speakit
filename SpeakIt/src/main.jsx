import 'bootswatch/dist/journal/bootstrap.min.css';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './pages/App';
import routes from './constants/routes';
import './assets/styles/style.css';


ReactDOM.render(
  <HashRouter basename={routes.LANDING}>
    <App />
  </HashRouter>,
  document.getElementById('root'),
);
