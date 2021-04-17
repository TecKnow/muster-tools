import "@fontsource/roboto";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import getStore from './app/store';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ApplicationDragDropContext from "./ApplicationDragDropContext"

const render = async () => {
  const store = await getStore();
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <ApplicationDragDropContext>
            <CssBaseline />
            <App />
          </ApplicationDragDropContext>
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
