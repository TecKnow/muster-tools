import React from "react";
import { connect } from "react-redux";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { Paper, Chip, Grid, Typography, RootRef } from "@material-ui/core/";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {
  makeGetTablePlayerRecords,
  MovePlayerToPosition
} from "../store/ducks/tables";

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if isDragging
  background: isDragging ? "lightgreen" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const Table = props => {
  const { tableUUID, TablePlayerRecords, classes } = props;
  return (
    <Droppable droppableId={tableUUID} type="TABLE">
      {(provided, snapshot) => {
        return (
          <RootRef rootRef={provided.innerRef}>
            <div {...provided.droppableProps}>
              <p>Table: UUID: {tableUUID}</p>
              <ol>
                {TablePlayerRecords.map((record, index) => {
                  return (
                    <Draggable
                      key={record.UUID}
                      draggableId={record.UUID}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {record.name}
                          </li>
                        </RootRef>
                      )}
                    </Draggable>
                  );
                })}
              </ol>
              {provided.placeholder}
            </div>
          </RootRef>
        );
      }}
    </Droppable>
  );
};

const makeMapStateToProps = () => {
  // Make your instance-specific selectors here
  // const tablePlayerRecords = makeGetTablePlayerRecords();
  const getTablePlayerRecords = makeGetTablePlayerRecords();
  const mapStateToProps = (state, props) => {
    const TablePlayerRecords = getTablePlayerRecords(state, props);
    return { TablePlayerRecords };
  };
  return mapStateToProps;
};

const TableConnected = connect(
  makeMapStateToProps,
  undefined
)(Table);

export default TableConnected;
