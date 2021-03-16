import React, { Fragment } from "react";

import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";

const hasNumber = (value) => {
  return new RegExp(/[0-9]/).test(value);
};

const hasMixed = (value) => {
  return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};

const hasCapital = (value) => new RegExp(/[A-Z]/).test(value);

const hasSmall = (value) => new RegExp(/[a-z]/).test(value);

const hasSpecial = (value) => {
  return new RegExp(/[~!#@$%^&*)(+._-]/).test(value);
};

export const strengthResponse = (count) => {
  if (count < 2) return { text: "Too Short", color: "red" };

  if (count < 3) return { text: "Very Weak", color: "orange" };

  if (count < 4) return { text: "Weak", color: "#fdcd1f" };

  if (count < 5) return { text: "Good", color: "#4fd24f" };

  if (count < 6) return { text: "Strong", color: "green" };
};

export const strengthIndicator = (value) => {
  let strengths = 0;

  if (value.length > 5) strengths++;

  if (value.length > 7) strengths++;

  if (hasNumber(value)) strengths++;

  if (hasSpecial(value)) strengths++;

  if (hasMixed(value)) strengths++;

  return strengths;
};

export const checkPasswordValidity = (pass) => {
  return (
    hasNumber(pass) && hasSpecial(pass) && hasMixed(pass) && pass.length >= 14
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(2, 2, 2),
  },
  listItem: {
    fontSize: "0.8rem",
  },
}));

export const InfoPopoverContent = ({ password }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography className={classes.title} variant="subtitle2" gutterBottom>
        Your Password must contain the following
      </Typography>
      <div className={classes.demo}>
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              {hasCapital(password) ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="Atleast one uppercase letter(A-Z)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {hasSmall(password) ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="Atleast one lower case letter(a-z)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {hasNumber(password) ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="Atleast one digit(0-9)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {hasSpecial(password) ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText primary="Atleast one special character(@#$%^&*)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {password.length >= 12 ? (
                <CheckCircleIcon style={{ color: "green" }} />
              ) : (
                <CancelIcon color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              className={classes.listItem}
              primary=" Password length should be >=12 characters."
            />
          </ListItem>
        </List>
      </div>
    </Fragment>
  );
};
