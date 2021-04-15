import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Paper, Typography } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { selectTableSeats } from "./features/seatsSlice";
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
    playerListArea: {
        minHeight: theme.spacing(1),
        minWidth: theme.spacing(1),
        display: 'flex',
        flexDirection: "column",
        flexWrap: 'nowrap',
        alignItems: "flex-start",
        justifyItems: "flex-start",
        '& > *': {
            margin: theme.spacing(0.5)
        },
    },
}));

const tableSeatsSelectorFunc = (tableId) => (state) => {
    return selectTableSeats(state, tableId)
}

const Table = ({ tableId }) => {
    const classes = useStyles();
    const unsortedTableSeats = useSelector(tableSeatsSelectorFunc(tableId));
    const tableSeats = unsortedTableSeats.slice().sort((a, b) => a.position - b.position)

    const listItems = tableSeats.map((seat) => (<Chip key={seat.id} label={seat.id} icon={<DragIndicatorIcon/>} className={classes.chip}/>));

    return (
        <Paper>
            <Typography>{`Table: ${tableId}`}</Typography>
            <div className={classes.playerListArea}>
                {listItems}
            </div>
        </Paper>

    );
}

export default Table;