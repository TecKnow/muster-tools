import React from "react"
import { Paper, Typography } from "@material-ui/core";
import { selectTableSeats } from "./features/seatsSlice";
import { useSelector } from 'react-redux'

const tableSeatsSelectorFunc = (tableId) => (state) => {
    return selectTableSeats(state, tableId)
}

const Table = ({ tableId }) => {

    const unsortedTableSeats = useSelector(tableSeatsSelectorFunc(tableId));
    const tableSeats = unsortedTableSeats.slice().sort((a, b) => a.position - b.position)

    const listItems = tableSeats.map((seat) => (<li key={seat.id}>{seat.id}, {seat.position}</li>));

    return (
        <Paper>
            <Typography>{`Table: ${tableId}`}</Typography>
            <ul>
                {listItems}
            </ul>
        </Paper>

    );
}

export default Table;