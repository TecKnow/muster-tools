import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "typeface-roboto";
import ApplicationDragDropContext from "./components/ApplicationDragDropContext";
import ApplicationMuiTheme from "./components/ApplicationMuiTheme";
import { store } from "./store";
import SignIn from "./components/sign-in";
import Chips from "./components/chips.js";
import Tables from "./components/tables.js";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ApplicationMuiTheme>
          <BrowserRouter>
            <ApplicationDragDropContext>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/signin" />
                </Route>
                <Route path="/signin" component={SignIn} />
                <Route path="/chips" component={Chips} />
                <Route path="/tables" component={Tables} />
              </Switch>
            </ApplicationDragDropContext>
          </BrowserRouter>
        </ApplicationMuiTheme>
      </Provider>
    );
  }
}

export default App;
