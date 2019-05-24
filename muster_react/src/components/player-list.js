import React from "react";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { Chip, Grid, RootRef } from "@material-ui/core/";
import { Draggable } from "react-beautiful-dnd";

const PlayerList = props => {
  const { playerRecords, classes } = props;
  return playerRecords.map((record, index) => {
    return (
      <Grid item key={record.UUID}>
        <Draggable key={record.UUID} draggableId={record.UUID} index={index}>
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <Chip
                icon={<DragIndicator />}
                label={record.name}
                className={classes.chip}
                variant={snapshot.isDragging ? "outlined" : "default"}
                style={provided.draggableProps.style}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              />
            </RootRef>
          )}
        </Draggable>
      </Grid>
    );
  });
};

export default PlayerList;
