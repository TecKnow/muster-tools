import React, { Component } from "react";
import "typeface-roboto";
import { Button } from "@material-ui/core";
import ApplicationDragDropContext from "./components/ApplicationDragDropContext";
import ApplicationMuiTheme from "./components/ApplicationMuiTheme";
import "./App.css";

class App extends Component {
  render() {
    return (
      <ApplicationMuiTheme>
        <ApplicationDragDropContext>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
        </ApplicationDragDropContext>
      </ApplicationMuiTheme>
    );
  }
}

export default App;
