import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from 'material-ui/AppBar';
import "./App.css";

class App extends Component {
  render() {
    return (

          <MuiThemeProvider>
            <AppBar
            title="D&D 5E Adventurer's League Sign-In"
            />
          </MuiThemeProvider>
    );
  }
}

export default App;
