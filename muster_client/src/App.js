import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import MusterBottomNavigation from "./MusterNavigationFrame"
import SignIn from "./Signin";
import TablesFrame from "./TablesFrame"

function App() {
  return (
    <div className="App">
      <MusterBottomNavigation>
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path ="/tables">
          <TablesFrame/>
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
