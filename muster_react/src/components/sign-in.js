import React from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Input,
  InputLabel,
  Paper,
  Typography,
  Checkbox
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import withStyles from "@material-ui/core/styles/withStyles";

// Based on the sample layout at the following URL:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/page-layout-examples/sign-in/SignIn.js

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  formControl: {
    marginTop: theme.spacing.unit * 3
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

function SignIn(props) {
  const { classes } = props;

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Muster sign-in
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" name="name" autoComplete="name" autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="DCINumber">DCI Number</InputLabel>
            <Input name="DCINumber" id="DCINumber" autoComplete="DCINumber" />
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Character Info</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox value="DM" />}
                label="Dungeon Master"
              />
              <FormControlLabel
                control={<Checkbox value="HalfHealer" />}
                label="Secondary Healing (Bard, Paladin, ...)"
              />
              <FormControlLabel
                control={<Checkbox value="PrimaryHealer" />}
                label="Primary Healing (Cleric, Druid, ...)"
              />
            </FormGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </main>
  );
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
