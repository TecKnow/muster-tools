import React from "react";
import { connect } from "react-redux";
import { Paper, Grid, Typography, RootRef } from "@material-ui/core/";
import { Droppable } from "react-beautiful-dnd";
import PlayerList from "./player-list";
import { makeGetTablePlayerRecords } from "../store/ducks/tables";

const Table = props => {
  const { tableUUID, TablePlayerRecords, classes } = props;
  return (
    <Paper className={classes.Paper}>
      <Typography variant="h5">Table: UUID: {tableUUID}</Typography>
      <Droppable droppableId={tableUUID} type="TABLE">
        {(provided, snapshot) => {
          return (
            <RootRef rootRef={provided.innerRef}>
              <Grid
                container
                direction="column"
                alignContent="flex-start"
                alignItems="flex-start"
                justify="flex-start"
                wrap="nowrap"
                className={classes.grid}
                {...provided.droppableProps}
              >
                <PlayerList
                  playerRecords={TablePlayerRecords}
                  classes={classes}
                />
                {provided.placeholder}
              </Grid>
            </RootRef>
          );
        }}
      </Droppable>
    </Paper>
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

const TableConnected = connect(makeMapStateToProps, undefined)(Table);

export default TableConnected;
