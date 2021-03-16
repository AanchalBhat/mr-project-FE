import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Input,
  Button,
  Typography,
  withStyles,
  InputLabel,
  FormControl, FormHelperText,
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import HelpIcon from '@material-ui/icons/Help';
import {
  strengthIndicator,
  strengthResponse,
  checkPasswordValidity,
  InfoPopoverContent,
} from '../../utils/strength-password';
import { checkEmail } from '../../utils/regex';

const Dialog = withStyles((theme) => ({
  root: {
    '& .MuiBackdrop-root': {
      display: 'none',
    },
  },
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: '#f7f7f7',
    border: '3px solid #3f51b5',
    borderRadius: '20px',
    boxShadow: '0 0 3px 3px #EEEEEE',
    maxWidth: 400,
  },
}))(MuiDialog);

const useStyles = makeStyles((theme) => ({
  mh: {
    margin: theme.spacing(0, 1),
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: 28,
    fontWeight: 600,
    textAlign: 'center',
  },
  otherLink: {
    display: 'flex',
    padding: theme.spacing(2, 0),
  },
  formControl: {
    margin: theme.spacing(0.5, 0),
    width: '100%',
  },
  button: {
    fontSize: 22,
    fontWeight: 600,
  },
  forgotLink: {
    position: 'absolute',
    right: '50px',
  },
  description: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
}));

const ActiveScreenModal = (props) => {
  const {
    error, handleActive, errorField,
  } = props;

  const classes = useStyles();

  const [user, setUser] = useState({
    userId: '',
    password: '',
    email: '',
  });
  const [passwordStrength, setPasswordStrength] = useState({
    text: '',
    color: '',
  });
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const id = useMemo(() => (open ? 'simple-popover' : undefined), [open]);
  const popoverOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const checkValidity = useMemo(() => user.userId.length >= 6
    && checkEmail(user.email)
    && checkPasswordValidity(user.password),
  [user]);

  const handleChange = (field) => (event) => {
    setUser({
      ...user,
      [field]: event.target.value,
    });
    if (field === 'password') {
      const strength = strengthIndicator(event.target.value);
      setPasswordStrength(strengthResponse(strength));
    }
  };

  const handleSubmit = useCallback(() => {
    handleActive(user);
  }, [handleActive, user]);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Dialog open aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Market Research Tool</Typography>
      </DialogTitle>
      <Typography className={classes.description}>
        Please choose your username, password and enter your email to activate your account.
      </Typography>
      <DialogContent>
        <FormControl
          error={user.userId === '' || (error && errorField === 'userId')}
          className={classes.formControl}
          value={user.userId || ''}
          onKeyUp={(e) => {
            if (e.which === 13) {
              handleSubmit();
            }
          }}
          onChange={handleChange('userId')}
        >
          <InputLabel htmlFor="user-name">User name</InputLabel>
          <Input id="user-name" type="text" />
        </FormControl>
        <FormControl
          required
          error={(error && !checkPasswordValidity(user.password))}
          className={classes.formControl}
        >
          <Popover
            id={id}
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            className={classes.popover}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <InfoPopoverContent password={user.password} />
          </Popover>
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={user.password}
            onChange={handleChange('password')}
            startAdornment={(
              <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password info"
                  style={{
                    padding: 0,
                    paddingRight: 6,
                  }}
                  onClick={handleClick}
                  onMouseDown={handleClick}
                >
                  <HelpIcon />
                </IconButton>
              </InputAdornment>
            )}
            endAdornment={(
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )}
          />
          {user.password ? (
            <p
              className={classes.passwordStrength}
              style={{ color: passwordStrength.color }}
            >
              {passwordStrength.text}
            </p>
          ) : (
            ''
          )}
        </FormControl>

        <FormControl
          required
          error={(error && !checkEmail(user.email)) || errorField === 'email'}
          className={classes.formControl}
        >
          <InputLabel htmlFor="email">User email</InputLabel>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={handleChange('email')}
          />
          {error && !checkEmail(user.email) ? (
            <FormHelperText>Invalid Email</FormHelperText>
          ) : (
            ''
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button disabled={!checkValidity} className={classes.button} onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ActiveScreenModal.propTypes = {
  error: PropTypes.bool,
  handleActive: PropTypes.func,
  errorField: PropTypes.string,
};

ActiveScreenModal.defaultProps = {
  error: false,
  handleActive: () => { },
  errorField: '',
};

export default ActiveScreenModal;
