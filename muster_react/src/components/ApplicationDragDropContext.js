import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";

class ApplicationDragDropContext extends Component {
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
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        {this.props.children}
      </DragDropContext>
    );
  }
}

export default ApplicationDragDropContext;
