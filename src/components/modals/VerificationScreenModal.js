import React, { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Input,
  Button,
  RadioGroup,
  Radio,
  Typography,
  withStyles,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';

const VerificationScreenModal = (props) => {
  const {
    user, error, handleVerify, handleSendCode, requiredField, errorMessage,
  } = props;

  const classes = useStyles();

  const [code, setCode] = useState('');
  const [mfaType, setMfaType] = useState('email');

  const handleChange = (e) => setCode(e.target.value);
  const handleChangeMFAType = (e) => setMfaType(e.target.value);

  const handleSubmit = useCallback(() => {
    handleVerify(code);
  }, [handleVerify, code]);

  const handleSend = useCallback(() => {
    handleSendCode(mfaType);
  }, [handleSendCode, mfaType]);

  const email = useMemo(() => {
    const temp = user.email.split('@');
    return `${temp[0].slice(0, 4)}****@${temp[1]}`;
  }, [user]);

  const phone = useMemo(() => `****${user.phone.slice(user.phone.length - 4, user.phone.length)}`, [user]);
  return (
    <Dialog open aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Market Research Tool</Typography>
      </DialogTitle>
      <Typography className={classes.description}>
        The verification code has been sent to your
        {mfaType === 'email' ? ` email\n ${email}` : ` phone number \n ${phone}`}
      </Typography>
      <DialogContent>
        <FormControl
          error={error || (requiredField && code === '')}
          className={classes.formControl}
          value={code || ''}
          onKeyUp={(e) => {
            if (e.which === 13) {
              handleSubmit();
            }
          }}
          onChange={handleChange}
        >
          <InputLabel htmlFor="user-name">Verification Code</InputLabel>
          <Input id="user-name" type="text" />
        </FormControl>

        <FormControl
          component="fieldset"
          className={classes.formControl}
        >
          <RadioGroup
            value={mfaType}
            onChange={handleChangeMFAType}
            aria-label="mfa-type"
            name="customized-radios"
          >
            <FormControlLabel value="email" control={<StyledRadio />} label={email} />
            <FormControlLabel value="sms" control={<StyledRadio />} label={phone} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSend}>Send again</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// Inspired by blueprintjs
const StyledRadio = (props) => {
  const classes = useStyles();

  return (
    <Radio
      className={classes.radio}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
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
  description: {
    color: '#000',
    fontSize: 18,
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
    textTransform: 'unset',
  },
  forgotLink: {
    position: 'absolute',
    right: '50px',
  },

  radio: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
}));

VerificationScreenModal.propTypes = {
  error: PropTypes.bool,
  handleVerify: PropTypes.func,
  user: PropTypes.object.isRequired,
  requiredField: PropTypes.bool,
  errorMessage: PropTypes.string,
  handleSendCode: PropTypes.func,
};

VerificationScreenModal.defaultProps = {
  error: false,
  errorMessage: '',
  handleVerify: () => { },
  handleSendCode: () => { },
  requiredField: false,
};

export default VerificationScreenModal;
