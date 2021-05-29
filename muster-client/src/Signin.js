import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { enrollPlayer } from "@grumbleware/event-muster-store";

/* Based on the sign-in template available at the following URL:
 * https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in
 */

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [playerName, setPlayerName] = useState("");
  const onPlayerNameChange = (event) => setPlayerName(event.target.value);
  const onPlayerSubmit = (event) => {
    event.preventDefault();
    dispatch(enrollPlayer({ name: playerName }));
    setPlayerName("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Sign-In
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.paper}>
        <Toolbar />
        <Avatar className={classes.avatar}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onPlayerSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="playername"
            label="player name"
            name="playerName"
            value={playerName}
            onChange={onPlayerNameChange}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
