import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "./table";

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  chip: {
    margin: theme.spacing.unit
  }
});

const Tables = props => {
  const { classes } = props;
  return (
    <div>
      <p>Tables</p>
      <Table tableUUID="deck" classes={classes} />
    </div>
  );
};

const makeMapStateToProps = () => {
  // Make your instance-specific selectors here
  // const tablePlayerRecords = makeGetTablePlayerRecords();
  const mapStateToProps = (state, props) => {
    return {};
  };
  return mapStateToProps;
};

// const mapDispatchToProps = {};

Tables.propTypes = {
  classes: PropTypes.object.isRequired
};

const TablesWithStyles = withStyles(styles)(Tables);

const TablesConnected = connect(
  makeMapStateToProps,
  undefined
)(TablesWithStyles);

export default TablesConnected;
