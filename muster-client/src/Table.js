import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Chip,
  Paper,
  Grid,
  Card,
  CardHeader,
  CardActions,
  IconButton,
} from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  selectTableSeats,
  deleteTable,
  deletePlayer,
} from "@grumbleware/event-muster-store";
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
  const dispatch = useDispatch();
  const classes = useStyles();
  const unsortedTableSeats = useSelector(tableSeatsSelectorFunc(tableId)) || [];
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
            onDelete={() => {
              dispatch(deletePlayer({ playerName: seat.id }));
            }}
          />
        </Grid>
      )}
    </Draggable>
  ));

  return (
    <Paper className={classes.paper}>
      <Card variant="outlined" className={classes.card}>
        <CardHeader title={`Table: ${tableId}`} />
        <CardActions>
          <IconButton
            aria-label="delete"
            onClick={() => {
              dispatch(deleteTable({ TableIdentifier: tableId }));
            }}
            size="small"
            disabled={tableId === 0 ? true : false}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
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
