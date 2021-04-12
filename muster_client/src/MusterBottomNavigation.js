import { Container, CssBaseline } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import React from 'react';

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
    bottomNav:
        { width: 500, }
});

export default function SimpleBottomNavigation({ children }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="sm">
                {children}
            </Container>
            <footer className={classes.footer}>
                <Container maxWidth="sm">
                    <BottomNavigation
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        showLabels
                        className={classes.bottomNav}
                    >
                        <BottomNavigationAction label="Sign In" icon={<PersonAddIcon />} />
                        <BottomNavigationAction label="Tables" icon={<ViewQuiltIcon />} />
                    </BottomNavigation>
                </Container>
            </footer>
        </div>
    );
}