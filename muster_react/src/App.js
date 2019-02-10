import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DragDropContext } from "react-beautiful-dnd";
import "typeface-roboto";
import { Button } from "@material-ui/core";
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
  // https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/responders.md

  onDragStart = start => {
    return;
  };
  onDragUpdate = () => {
    return;
  };
  onDragEnd = () => {
    // the only one that is required
    return;
  };
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <CssBaseline />
          <Button variant="contained" color="primary">
            Hello World
          </Button>
        </DragDropContext>
      </MuiThemeProvider>
    );
  }
}

export default App;
