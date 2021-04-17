import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Paper, Typography, Grid } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { selectTableSeats } from "./features/seatsSlice";
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    playerListArea: {
        minHeight: theme.spacing(5),
        padding: theme.spacing(1),
    },
}));

const tableSeatsSelectorFunc = (tableId) => (state) => {
    return selectTableSeats(state, tableId)
}

const Table = ({ tableId }) => {
    const classes = useStyles();
    const unsortedTableSeats = useSelector(tableSeatsSelectorFunc(tableId));
    const tableSeats = unsortedTableSeats.slice().sort((a, b) => a.position - b.position)

    const listItems = tableSeats.map((seat) => (<Grid item><Chip key={seat.id} label={seat.id} icon={<DragIndicatorIcon />} className={classes.chip} /></Grid>));

    return (
        <Paper className={classes.paper}>
            <Typography>{`Table: ${tableId}`}</Typography>
            <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={1} className={classes.playerListArea}>
                {listItems}
            </Grid>
        </Paper>

    );
}

export default Table;