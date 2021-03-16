import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Input,
  Button,
  Link,
  Typography,
  withStyles,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@material-ui/core'
import MuiDialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/styles'

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
    position: "absolute",
    right: "50px"
  }
}));

const LoginModal = (props) => {
  const classes = useStyles();

  const { error, handleLogin, requiredField, errorMessage } = props;
  const [user, setUser] = useState({
    userId: '',
    password: '',
  });
  const handleChange = (field) => (event) => {
    setUser({
      ...user,
      [field]: event.target.value,
    });
  };

  const handleClickLogin = () => {
    handleLogin(user)
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
          value={user.userId || ''}
          onKeyUp={e => {
            if (e.which === 13) {
              handleClickLogin()
            }
          }}
          onChange={handleChange('userId')}
        >
          <InputLabel htmlFor="user-name">User name</InputLabel>
          <Input id="user-name" type="text" />
        </FormControl>
        <FormControl
          error={error || (requiredField && user.password === '')}
          className={classes.formControl}
          value={user.password || ''}
          onKeyUp={e => {
            if (e.which === 13) {
              handleClickLogin()
            }
          }}
          onChange={handleChange('password')}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" />
          {error && (<FormHelperText>{errorMessage}</FormHelperText>)}
          {requiredField && (<FormHelperText>Username or Password are required.</FormHelperText>)}
        </FormControl>
        <div className={classes.otherLink}>
          <Link  href="/forgot/username">
            Forgot Username?
          </Link>
          <Link className={classes.forgotLink} href="/forgot/password">
            Forgot Password?
          </Link>
        </div>
        {/* <div >
          <Link className={classes.createLinK} href="/sign-up">
            Create account
          </Link>
        </div> */}
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={handleClickLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LoginModal.propTypes = {
  error: PropTypes.bool,
  handleLogin: PropTypes.func,
};

LoginModal.defaultProps = {
  error: false,
  errorMessage: '',
  handleLogin: () => {
  },
};

export default LoginModal;
