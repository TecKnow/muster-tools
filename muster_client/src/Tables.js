import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { selectTableIds } from "@grumbleware/event-muster-store";
import Table from "./Table";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const TableSpread = (tableIds) => {
  return tableIds.map((tableId) => (
    <Grid item xs={12} sm={6} lg={3} key={`table grid item key: ${tableId}`}>
      <Table key={`table key: ${tableId}`} tableId={tableId} />
    </Grid>
  ));
};

const Tables = () => {
  const classes = useStyles();
  const tableIds = useSelector(selectTableIds);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {TableSpread(tableIds)}
      </Grid>
    </div>
  );
};
export default Tables;
