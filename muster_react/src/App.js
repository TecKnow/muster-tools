import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "typeface-roboto";
import ApplicationDragDropContext from "./components/ApplicationDragDropContext";
import ApplicationMuiTheme from "./components/ApplicationMuiTheme";
import SignIn from "./components/sign-in";

class App extends Component {
  render() {
    return (
      <ApplicationMuiTheme>
        <BrowserRouter>
          <ApplicationDragDropContext>
            <Switch>
              <Route exact path="/">
                <Redirect to="/signin" />
              </Route>
              <Route path="/signin" component={SignIn} />
            </Switch>
          </ApplicationDragDropContext>
        </BrowserRouter>
      </ApplicationMuiTheme>
    );
  }
}

export default App;
