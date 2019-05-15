import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { Paper, Chip, Grid, Typography, RootRef } from "@material-ui/core/";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import playerList from "./test-playerlist";

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

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if isDragging
  background: isDragging ? "lightgreen" : "",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : ""
});

class ChipList extends React.PureComponent {
  render() {
    const { players, classes } = this.props;
    return players.map((player, index) => (
      <Draggable key={player} draggableId={player} index={index} type="TABLE">
        {(provided, snapshot) => (
          <RootRef rootRef={provided.innerRef}>
            <Grid
              item
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <Chip
                icon={<DragIndicator />}
                label={player}
                className={classes.chip}
              />
            </Grid>
          </RootRef>
        )}
      </Draggable>
    ));
  }
}

class Chips extends React.Component {
  constructor(props) {
    super(props);
    this.state = playerList;
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state["Table-1"],
      result.source.index,
      result.destination.index
    );

    this.setState({
      "Table-1": items
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="Table1" type="TABLE">
          {(provided, snapshot) => {
            return (
              <RootRef rootRef={provided.innerRef}>
                <Paper
                  className={classes.paper}
                  {...provided.droppableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  <Typography variant="h5" gutterBottom>
                    Table 1
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Dungeon Master
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Players
                  </Typography>
                  <Grid
                    container
                    direction="column"
                    alignContent="flex-start"
                    alignItems="flex-start"
                    justify="flex-start"
                    wrap="nowrap"
                    className={classes.grid}
                  >
                    <ChipList
                      players={this.state["Table-1"]}
                      classes={classes}
                    />
                  </Grid>
                  {provided.placeholder}
                </Paper>
              </RootRef>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  }
}

Chips.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chips);
