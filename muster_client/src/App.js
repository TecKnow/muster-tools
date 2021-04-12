import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import SignIn from "./signin";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/">
          <Redirect to="/signin" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
