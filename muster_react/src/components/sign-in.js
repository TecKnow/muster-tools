import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { is } from "immutable";
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
import {
  getPlayersWithName,
  getPlayersWithDCINumber
} from "../store/ducks/known-players";
import { SignInPlayer } from "../store/ducks/current-players";

// Based on the sample layout at the following URL:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/page-layout-examples/sign-in/SignIn.js

//TODO: Implement auto-completion for name and DCI fields.

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

const SignIn = props => {
  const { classes, handleSubmit } = props;
  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Muster sign-in
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
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
};

const validate = values => {
  const errors = {};
  if (!values.has("name")) {
    errors.name = "Required";
  }
  if (!values.has("DCINumber")) {
    errors.DCINumber = "Required";
  } else if (!/^\d{10}$/.test(values.get("DCINumber"))) {
    errors.DCINumber = "Must be a 10 digit positive integer";
  }
  return errors;
};

const onChange = (values, dispatch, props, previousValues) => {
  // The most relevant props you want here are as follows:
  // previousValues  -  Note that it only contains the changed values
  // props.synchErrors - This seems to be based on the previous values, not the new ones.

  const { autofill, getPlayersWithName, getPlayersWithDCINumber } = props;
  //Match names to DCI numbers
  if (!is(previousValues.get("name"), values.get("name"))) {
    const potentialNameMatch = getPlayersWithName(values.get("name"));
    if (
      !is(potentialNameMatch, undefined) &&
      is(potentialNameMatch.size, 1) &&
      !/^\d{10}$/.test(values.get("DCINumber"))
    ) {
      autofill("DCINumber", potentialNameMatch.first().DCINumber);
    }
  }
  // Match DCI numbers to names
  if (!is(previousValues.get("DCINumber"), values.get("DCINumber"))) {
    const potentialDCIMatch = getPlayersWithDCINumber(values.get("DCINumber"));
    if (!is(potentialDCIMatch, undefined) && is(potentialDCIMatch.size, 1)) {
      autofill("name", potentialDCIMatch.first().name);
    }
  }
};

const onSubmit = (values, dispatch, props) => {
  console.log("Props inside onSubmit are:", props);
  props.SignInPlayer(values.get("name"), values.get("DCINumber"));
  // TODO: This isn't the axiomatic way of clearing forms, although it works.  Improve it.
  props.reset();
};

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  getPlayersWithName: name => getPlayersWithName(state, name),
  getPlayersWithDCINumber: DCINumber =>
    getPlayersWithDCINumber(state, DCINumber)
});

const mapDispatchToProps = {
  SignInPlayer
};

const SignInWithStyles = withStyles(styles)(SignIn);

const SignInReduxForm = reduxForm({
  form: "signIn",
  validate,
  onChange,
  onSubmit
})(SignInWithStyles);

const SignInConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInReduxForm);

export default SignInConnected;
