import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  withStyles,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Input,
  InputLabel
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Axios } from '../../utils/axios';
import { strengthIndicator, strengthResponse } from '../../utils/strength-password';

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
    fontSize: 20,
    fontWeight: 600,
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1, 0),
    width: '100%',
  },
  button: {
    fontSize: 18,
    fontWeight: 600,
  },
  passwordStrength: {
    fontWeight: 600,
    margin: '2px',
    textAlign: 'right',
    fontSize: '13px'
  },
  errorMessage: {
    color: 'red'
  },
  successMessage: {
    color: 'green'
  }
}));

const ResetModal = (props) => {
    const classes = useStyles();
    const { handleResetRequest } = props;

    const [open, setOpen] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false)
    const [new_password, setNewPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] =  useState(false);
    const [passwordStrength, setPasswordStrength] = useState({text: '', color: ''});
    const [error] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =  useState(false);
    const [successMessage, setSuccessMessage] = useState(false)

    const handleRequest = () => {
      setOpen(true);
      if(new_password === confirm_password) {
        let token = props.token;
        Axios.post('/auth/reset-password', {new_password, token})
          .then(res => {
            setErrorMessage();
            setSuccessMessage('Password reset Successfully !!')
            setTimeout(()=> {
                handleResetRequest();            
              }, 3000); 
          })
          .catch(err =>{
            setErrorMessage("Error Occurred ");
          })
      }
      else {
        setSuccessMessage();
        setErrorMessage("Passwords doesn't match.");
      }
    };
 
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    };
    
    const handleClickShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword)
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handlePasswordChange = (value) => {
      setNewPassword(value);
      const strength = strengthIndicator(value);
      setPasswordStrength(strengthResponse(strength));
      }

      const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
      }
  
  return (
    <>
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Please enter your new password.</Typography>
      </DialogTitle>
      <DialogContent>
      <FormControl required error={error && new_password === ''} className={classes.formControl}>
          <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? 'text' : 'password'}
          value={new_password}
          onChange={e=> handlePasswordChange(e.target.value)}
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
          {(new_password)?<p className={classes.passwordStrength} style={{color:passwordStrength.color}}>{passwordStrength.text}</p>:''}
      </FormControl>
<FormControl required error={error && confirm_password === ''} className={classes.formControl}>
          <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirm_password}
          onChange={e=> handleConfirmPasswordChange(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      {errorMessage && (<FormHelperText className={classes.errorMessage}>{errorMessage}</FormHelperText>)}
      {successMessage && (<FormHelperText className={classes.successMessage}>{successMessage}</FormHelperText>)}

      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={handleRequest} color="primary">
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
      </>
  );
};
ResetModal.propTypes = {
    handleResetRequest: PropTypes.func,
  };
  
  ResetModal.defaultProps = {
    handleResetRequest: () => {
    },
  };

export default ResetModal;
