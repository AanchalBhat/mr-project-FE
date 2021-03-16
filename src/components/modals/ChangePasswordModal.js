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
  FormControl,
  FormHelperText,
  Popover,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import HelpIcon from '@material-ui/icons/Help';
import MuiDialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/styles'
import {
  strengthIndicator,
  strengthResponse,
  checkPasswordValidity,
  InfoPopoverContent,
} from '../../utils/strength-password';

const ChangePasswordModal = (props) => {
  const { error, handleSkip, handleChangePassword, requiredField, errorMessage } = props;

  const classes = useStyles();

  const [user, setUser] = useState({
    originPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    text: '',
    color: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(true);

  const popoverOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = useMemo(() => open ? 'simple-popover' : undefined, [open]);

  const handleChange = (field) => (event) => {
    setUser({
      ...user,
      [field]: event.target.value,
    });
    if (field === 'newPassword') {
      const strength = strengthIndicator(event.target.value);
      setPasswordStrength(strengthResponse(strength));
    }
  };

  const handleSubmit = useCallback(() => {
    handleChangePassword(user)
  },[handleChangePassword, user])

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Dialog open aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Market Research Tool</Typography>
      </DialogTitle>
      <DialogContent>
        <FormControl
          error={error || (requiredField && user.userId === '') }
          className={classes.formControl}
          value={user.OldPassword || ''}
          onKeyUp={e => {
            if (e.which === 13) {
              handleSubmit()
            }
          }}
          onChange={handleChange('OldPassword')}
        >
          <InputLabel htmlFor="user-name">Old Password</InputLabel>
          <Input id="user-name" type="password" />
        </FormControl>

        <FormControl
          requiredField
          error={error && !checkPasswordValidity(user.newPassword)}
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
            <InfoPopoverContent password={user.newPassword} />
          </Popover>
          <InputLabel htmlFor="standard-adornment-password">
            New Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={user.newPassword}
            onChange={handleChange('newPassword')}
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
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {user.newPassword ? (
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
          error={error || (requiredField && user.confirmPassword === '')}
          className={classes.formControl}
          value={user.FormControl || ''}
          onKeyUp={e => {
            if (e.which === 13) {
              handleSubmit()
            }
          }}
          onChange={handleChange('confirmPassword')}
        >
          <InputLabel htmlFor="password">Confirm Password</InputLabel>
          <Input id="password" type="password" />
          {error && (<FormHelperText>{errorMessage}</FormHelperText>)}
          {requiredField && (<FormHelperText>Username or Password are required.</FormHelperText>)}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={handleSkip} color="primary">
          Skip
        </Button>
        <Button className={classes.button} onClick={handleSubmit} color="primary">
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};



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
    textTransform: 'unset'
  },
  forgotLink: {
    position: "absolute",
    right: "50px"
  },
  passwordStrength: {
    fontWeight: 600,
    margin: '2px',
    textAlign: 'right',
    fontSize: '13px',
  },
  popover: {
    padding: theme.spacing(2),
  },
}));

ChangePasswordModal.propTypes = {
  error: PropTypes.bool,
  handleActive: PropTypes.func,
};

ChangePasswordModal.defaultProps = {
  error: false,
  errorMessage: '',
  handleActive: () => { },
};

export default ChangePasswordModal;
