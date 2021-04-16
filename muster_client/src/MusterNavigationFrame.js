import { Container, CssBaseline } from '@material-ui/core';
import RouterBottomNavigation from "./RouterBottomNavigation"
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import React from 'react';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    },
    main: {

    },
    footer:
    {
        marginTop: "auto"
    },
});

export default function MusterNavigationFrame({ children }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="lg">
                {children}
            </Container>
            <footer className={classes.footer}>
                <Container maxWidth="sm">
                    <RouterBottomNavigation
                        showLabels
                    >
                        <BottomNavigationAction label="Sign In" icon={<PersonAddIcon />} component={Link} to="/signin" />
                        <BottomNavigationAction label="Tables" icon={<ViewQuiltIcon />} component={Link} to="/tables" />
                    </RouterBottomNavigation>
                </Container>
            </footer>
        </div>
    );
}