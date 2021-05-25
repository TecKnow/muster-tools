import { useDispatch } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import React from "react";
import Tables from "./Tables";
import {
  createTable,
  shuffleZero,
  requestResetSeats,
} from "@grumbleware/event-muster-store";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function ClippedDrawer() {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Tables
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <Divider />
          <List>
            <ListItem
              button
              key="add"
              onClick={() => {
                dispatch(createTable());
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Table" />
            </ListItem>
            <ListItem
              button
              key="shuffle"
              onClick={() => {
                dispatch(shuffleZero());
              }}
            >
              <ListItemIcon>
                <ShuffleIcon />
              </ListItemIcon>
              <ListItemText primary="Shuffle Bench" />
            </ListItem>
            <ListItem
              button
              key="clearTables"
              onClick={() => {
                dispatch(requestResetSeats());
              }}
            >
              <ListItemIcon>
                <ClearAllIcon />
              </ListItemIcon>
              <ListItemText primary="Clear Tables" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Tables />
      </main>
    </div>
  );
}
