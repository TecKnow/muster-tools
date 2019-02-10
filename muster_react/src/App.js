import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import CssBaseline from "@material-ui/core/CssBaseline";
import "typeface-roboto";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: blue
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
      </MuiThemeProvider>
    );
  }
}

export default App;
