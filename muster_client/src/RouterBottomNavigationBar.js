import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import {useLocation} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: 500,
    }
});

export default function RouterBottomNavigation({ children }) {
    const classes = useStyles();
    const location = useLocation();
    
    const buttonMatcher = (child) => {
        const match = location.pathname.startsWith(child.props.to);
        return match;
    }

    const NavValueFunc = (children) => {
        const childrenArray = React.Children.toArray(children);
        const matchIndex = childrenArray.findIndex(buttonMatcher);
        return matchIndex;
    }

    return (<BottomNavigation
        showLabels
        className={classes.root}
        value={NavValueFunc(children)}
    >
        {children}
    </BottomNavigation>
    );
}