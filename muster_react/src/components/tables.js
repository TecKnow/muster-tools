import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Fab, Grid } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import {
  getAllTablesUUIDs,
  CreateTable_Stateless
} from "../store/ducks/tables";
import Table from "./table";

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  chip: {
    margin: theme.spacing.unit
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

const Tables = props => {
  const { TableUUIDs, createTable, classes } = props;
  return (
    <Grid
      container
      spacing={8}
      direction="row"
      alignContent="flex-start"
      alignItems="flex-start"
      justify="flex-start"
    >
      <Grid item key="deck">
        <Table tableUUID="deck" classes={classes} />
      </Grid>
      {TableUUIDs.map(TableUUID => (
        <Grid item key={TableUUID}>
          <Table tableUUID={TableUUID} classes={classes} />
        </Grid>
      ))}

      <Fab
        color="primary"
        aria-label="Add"
        onClick={createTable}
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </Grid>
  );
};

const mapStateToProps = (state, props) => {
  const AllTableUUIDs = getAllTablesUUIDs(state);
  const TableUUIDsExceptDeck = AllTableUUIDs.delete("deck");
  return { TableUUIDs: TableUUIDsExceptDeck };
};

const mapDispatchToProps = { createTable: CreateTable_Stateless };

Tables.propTypes = {
  classes: PropTypes.object.isRequired
};

const TablesWithStyles = withStyles(styles)(Tables);

const TablesConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesWithStyles);

export default TablesConnected;
