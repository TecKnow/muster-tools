import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import MusterBottomNavigation from "./MusterBottomNavigation"
import SignIn from "./signin";

function App() {
  return (
    <div className="App">
      <MusterBottomNavigation>
      <Switch>
        <Route path="/signin">
          <SignIn />
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
