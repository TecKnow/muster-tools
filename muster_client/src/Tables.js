import React from "react"
import {useSelector} from "react-redux"
import { makeStyles } from '@material-ui/core/styles';
import {selectTableIds} from "./features/tablesSlice";
import Table from "./Table";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: "column",
        flexWrap: 'wrap',
        '& > *': {

        },
    },
}));

const TableSpread = (tableIds) => {
    return tableIds.map(tableId => (<Table key={tableId} tableId={tableId}/>));
}

const Tables = () => {
    const classes = useStyles();
    const tableIds = useSelector(selectTableIds)
    return (
        <div className={classes.root}>
            {TableSpread(tableIds)}
        </div>
    );
}
export default Tables;