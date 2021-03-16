import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  withStyles,
  InputLabel,
  FormControl,
  Input,
  FormHelperText
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import { Axios } from '../../utils/axios';

import { checkEmail } from '../../utils/regex'

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
    margin: theme.spacing(0.5, 0),
    width: '100%',
  },
  button: {
    fontSize: 18,
    fontWeight: 600,
  },
  errorMessage: {
    color: 'red'
  },
  successMessage: {
    color: 'green'
  }
}));

const ForgotModal = (props) => {
  const classes = useStyles();
  const { handleForgotRequest , handleBackpage} = props;
  // const handleClickLogout = () => {
  //   window.localStorage.clear()
  //   handleLogout();
  // };
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  const [value, setValue] = useState('');
  const handleRequest = () => {
    let query = props.query;
    if (!value) {
      if (query === 'username') {
        setError(true)
        setErrorMessage("Username is required");
      }
      else {
        setError(true)
        setErrorMessage("Email is required");
      }
    }
    Axios.post('/auth/forgot', { value, query })
      .then(res => {
        setError(false)
        let data = res.data;
        if (data.status) {
          setErrorMessage();
          setSuccessMessage(data.message);
          setTimeout(() => {
            handleForgotRequest()
          }, 3000);
        }
        else {
          setError(true);
          setSuccessMessage();
          setErrorMessage(data.message);
        }
      })
      .catch(err => {
        setError(true);
      })
    setOpen(true);
  };
  const handleBack = () => {
    setOpen(false);
    handleBackpage();
  };

  const handleChange = (event) => {
    setValue(event.target.value);

  }
  return (
    <>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        {props.query === 'username' ?
          (<>
            <DialogTitle>
              <Typography className={classes.title}>Please enter your recovery email to receive username.</Typography>
            </DialogTitle>
            <DialogContent>
              <FormControl
                error={error || (value !== '' && checkEmail(value))}
                className={classes.formControl}
                value={value || ''}
                onKeyPress={e => {
                  if (e.which === 13)
                    handleRequest() 
                }}
                onChange={handleChange}
              >
                <InputLabel htmlFor="email">Recovery email</InputLabel>
                <Input id="email" type="email" />
              </FormControl>
              {errorMessage && (<FormHelperText className={classes.errorMessage}>{errorMessage}</FormHelperText>)}
              {successMessage && (<FormHelperText className={classes.successMessage}>{successMessage}</FormHelperText>)}

            </DialogContent></>
          ) :
          (<>
            <DialogTitle>
              <Typography className={classes.title}>Please enter your username to reset password.</Typography>
            </DialogTitle>
            <DialogContent>

              <FormControl
                error={error}
                className={classes.formControl}
                value={value || ''}
                onKeyPress={e => {
                  if (e.which === 13)
                    handleRequest() 
                }}
                onChange={handleChange}
              >
                <InputLabel htmlFor="email">Username or Email</InputLabel>
                <Input id="username" type="text" />
              </FormControl>
              {errorMessage && (<FormHelperText className={classes.errorMessage}>{errorMessage}</FormHelperText>)}
              {successMessage && (<FormHelperText className={classes.successMessage}>{successMessage}</FormHelperText>)}
            </DialogContent></>
          )
        }
        <DialogActions>
        <Button className={classes.button} 
        onClick={handleBack}
         color="secondary">
          Cancel
        </Button>
          <Button className={classes.button} onClick={handleRequest} color="primary">
            Send Request
        </Button>
        
        </DialogActions>
      </Dialog>
    </>
  );
};

ForgotModal.propTypes = {
  handleForgotRequest: PropTypes.func,

};

ForgotModal.defaultProps = {
  handleForgotRequest: () => {
  },
  
}


export default ForgotModal;
