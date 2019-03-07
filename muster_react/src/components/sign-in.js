import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  Paper,
  Typography
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import withStyles from "@material-ui/core/styles/withStyles";
import { Field, reduxForm } from "redux-form/immutable";
import {
  RenderTextField,
  RenderCheckboxField
} from "./material-ui-redux-form-components";

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

const MUICharacterInfo = props => {
  const classes = props.classes;
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Character Info</FormLabel>
      <FormGroup>
        <Field
          name="DM"
          label="Dungeon Master"
          component={RenderCheckboxField}
        />
        <Field
          name="HalfHealer"
          label="Secondary Healing (Bard, Paladin, ...)"
          component={RenderCheckboxField}
        />
        <Field
          name="PrimaryHealer"
          label="Primary Healing (Cleric, Druid, ...)"
          component={RenderCheckboxField}
        />
      </FormGroup>
    </FormControl>
  );
};

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
          <Field
            name="name"
            label="Name"
            margin="normal"
            required
            fullWidth
            autoFocus
            autoComplete="name"
            component={RenderTextField}
          />
          <Field
            name="DCINumber"
            label="DCI Number"
            margin="normal"
            autoComplete="DCINumber"
            type="number"
            min={0}
            required
            fullWidth
            component={RenderTextField}
          />
          <MUICharacterInfo classes={classes} />

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
const SignInReduxForm = reduxForm({ form: "signIn" })(SignIn);
const SignInWithStyles = withStyles(styles)(SignInReduxForm);
export default SignInWithStyles;
