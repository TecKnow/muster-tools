import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { MovePlayerToPosition_Stateless } from "../store/ducks/tables";

class ApplicationDragDropContext extends Component {
  // https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/guides/responders.md

  onDragStart = start => {
    return;
  };
  onDragUpdate = () => {
    return;
  };
  onDragEnd = result => {
    // the only one that is required
    console.log(result);
    if (!result.destination) {
      return;
    }
    const { MovePlayerToPosition } = this.props;
    const player = result.draggableId;
    const table = result.destination.droppableId;
    const position = result.destination.index;
    MovePlayerToPosition({ player, table, position });
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

const mapDispatchToProps = {
  MovePlayerToPosition: MovePlayerToPosition_Stateless
};

const ApplicationDragDropContextConnected = connect(
  undefined,
  mapDispatchToProps
)(ApplicationDragDropContext);

export default ApplicationDragDropContextConnected;
