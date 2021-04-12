import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import MusterBottomNavigation from "./MusterNavigationFrame"
import SignIn from "./signin";

function App() {
  return (
    <div className="App">
      <MusterBottomNavigation>
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path ="/tables">
          <h1>HELLO TABLE WORLD!</h1>
        </Route>
        <Route path="/">
          <Redirect to="/signin" />
        </Route>
      </Switch>
      </MusterBottomNavigation>
    </div>

  );
}

export default App;
