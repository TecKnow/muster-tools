import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Chip, Paper, Typography, Grid } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { selectTableSeats } from "./features/seatsSlice";
import { useSelector } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) => ({
  playerListArea: {
    minHeight: theme.spacing(5),
    padding: theme.spacing(1),
  },
}));

const tableSeatsSelectorFunc = (tableId) => (state) => {
  return selectTableSeats(state, tableId);
};

const Table = ({ tableId }) => {
  const classes = useStyles();
  const unsortedTableSeats = useSelector(tableSeatsSelectorFunc(tableId));
  const tableSeats = unsortedTableSeats
    .slice()
    .sort((a, b) => a.position - b.position);

  const listItems = tableSeats.map((seat) => (
    <Draggable
      draggableId={`seat grid item draggable id:${seat.id}`}
      index={seat.position}
      key={`seat grid item draggable key:${seat.id}`}
    >
      {(provided) => (
        <Grid
          item
          key={`seat grid item key:${seat.id}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Chip
            key={`seat chip key:${seat.id}`}
            label={seat.id}
            icon={<DragIndicatorIcon />}
            className={classes.chip}
          />
        </Grid>
      )}
    </Draggable>
  ));

  return (
    <Paper className={classes.paper}>
      <Typography>{`Table: ${tableId}`}</Typography>
      <Droppable
        droppableId={`table droppable id: ${tableId}`}
        key={`table droppable key: ${tableId}`}
      >
        {(provided) => (
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            spacing={1}
            className={classes.playerListArea}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {listItems}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </Paper>
  );
};

export default Table;
