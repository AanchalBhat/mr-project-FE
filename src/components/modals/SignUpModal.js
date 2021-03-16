import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Input,
  Button,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  withStyles,
  TextField,
  InputAdornment,
  IconButton,
  Popover,
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import MuiGrid from '@material-ui/core/Grid';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import HelpIcon from '@material-ui/icons/Help';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PhoneInput from 'react-phone-input-2';
import { adminRoles } from '../../utils/constant';
import CustomDropdown from '../dropdown';
import 'react-phone-input-2/lib/style.css';
import { Axios } from '../../utils/axios';
import {
  strengthIndicator,
  strengthResponse,
  checkPasswordValidity,
  InfoPopoverContent,
} from '../../utils/strength-password';

import {
  checkEmail,
  checkAlphabetsWithDotAndSpace,
  checkAlphaOnly,
  checkAphaNumeric,
} from '../../utils/regex';

const SignUpModal = (props) => {
  const { handleSignUp, handleCancel, showToast } = props;

  const classes = useStyles();

  const [error, setError] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [officeSymbol, setOfficeSymbol] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    text: '',
    color: '',
  });
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState('System Admin');
  const [disabled, setDisabled] = useState(false);
  const [agencyCode, setAgencyCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const agency_name = useMemo(
    () => ({
      options: agencies,
      freeSolo: true,
      getOptionLabel: (option) => option.Agency_Name,
    }),
    [agencies],
  );

  const roleOptions = useMemo(
    () => adminRoles.map((r) => ({
      value: r.split(' ').join('_'),
      label: r,
    })),
    [],
  );

  const user = useMemo(
    () => ({
      userId,
      agency_code: agencyCode,
      phone,
      organization: orgName,
      office_symbol: officeSymbol,
      firstname,
      middlename,
      lastname,
      email,
      password,
      role,
    }),
    [
      userId,
      agencyCode,
      phone,
      orgName,
      officeSymbol,
      firstname,
      middlename,
      lastname,
      email,
      password,
      role,
    ],
  );

  const popoverOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = useMemo(() => (open ? 'simple-popover' : undefined), [open]);

  const checkValidity = () => {
    const agencyCode = disabled ? user.agency_code.length >= 4 : true;
    const officeSymbol = disabled ? user.office_symbol.trim() !== '' : true;
    return (
      user.userId.length >= 6
        && checkEmail(user.email)
        && user.phone.length >= 11
        && user.firstname.trim() !== ''
        && user.lastname.trim() !== ''
        && checkPasswordValidity(user.password)
        && user.organization.trim() !== ''
        && agencyCode
        && officeSymbol
    );
  };

  const handleRegister = () => {
    setError(false);
    if (checkValidity()) {
      // setOpen(false);
      Axios.post('/auth/signup', user)
      .then((res) => {
        if (res.data.status) {
          showToast({
            type: 'success',
            message: 'You have been successfully registered and will be redirected to Login Page!',
          });
          handleSignUp();
          setOpen(false);
        }
        if (res.data.message === 'User already exist') {
          showToast({
            type: 'error',
            message: 'User already exist',
          });
        }
      })
      .catch((err) => {
        console.info(err);
        showToast({
          type: 'error',
          message: 'All fields are required.',
        });
      });
    } else {
      setError(true);
    }
  };

  const handleBack = () => {
    setOpen(false);
    handleCancel();
  };

  const handleChangeRole = (event) => {
    const e = event.split('_').join(' ');
    setRole(e);
  };

  const handleChangeAgencyCode = (event, value) => {
    if (value) {
      setAgencyCode(value.Agency_ID);
      setOrgName(value.Agency_Name);
      setDisabled(true);
    } else {
      setAgencyCode('');
      setDisabled(false);
    }
  };

  const handleAgencyCodeValue = (value) => {
    setAgencyCode(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const strength = strengthIndicator(value);
    setPasswordStrength(strengthResponse(strength));
  };

  useEffect(() => {
    getAgencies();
  }, []);

  const getAgencies = async () => {
    Axios.get('/agency/all')
      .then((res) => {
        setAgencies(res.data.data);
      })
      .catch((err) => {
      });
  };

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
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Market Research Tool</Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={3} className={classes.fullWidth}>
          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && userId.length < 6}
              className={classes.formControl}
            >
              <InputLabel htmlFor="code">User Id</InputLabel>
              <Input
                id="code"
                type="text"
                value={userId}
                onKeyPress={(e) => {
                  if (
                    (e.target.value.length === 0 && !checkAlphaOnly(e.key))
                    || e.target.value.length >= 20
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setUserId(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl required className={classes.formControl}>
              <Autocomplete
                {...agency_name}
                id="organization_name"
                onChange={handleChangeAgencyCode}
                htmlFor="organization_name"
                onKeyPress={(e) => {
                  if (
                    !checkAlphabetsWithDotAndSpace(e.key)
                    || e.target.value.length >= 30
                  ) {
                    e.preventDefault();
                  }
                }}
                onInputChange={(e) => setOrgName(e.target.value)}
                renderInput={(params) => (
                  <TextField
                    required
                    error={
                      error
                      && (!user.organization
                        || (user.organization && user.organization.trim() === ''))
                    }
                    {...params}
                    label="Organization name"
                    margin="none"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && agencyCode.length < 4}
              className={classes.formControl}
            >
              <InputLabel htmlFor="agency-code">Agency code</InputLabel>
              <Input
                id="agency_code"
                value={agencyCode}
                disabled={disabled}
                onKeyPress={(e) => {
                  if (e.target.value.length === 6 || !checkAphaNumeric(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => handleAgencyCodeValue(e.target.value)}
                type="text"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && user.office_symbol.trim() === ''}
              className={classes.formControl}
            >
              <InputLabel htmlFor="office_symbol">Office symbol</InputLabel>
              <Input
                id="office_symbol"
                type="text"
                value={officeSymbol}
                onChange={(e) => setOfficeSymbol(e.target.value)}
                onKeyPress={(e) => {
                  if (e.target.value.length >= 20) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && !checkEmail(user.email)}
              className={classes.formControl}
            >
              <InputLabel htmlFor="email">User email</InputLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && !checkEmail(user.email) ? (
                <FormHelperText>Invalid Email</FormHelperText>
              ) : (
                ''
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && phone.length < 11}
              className={classes.formControl}
            >
              <PhoneInput
                country="us"
                mask="(999) 999-9999"
                label="Phone1"
                value={phone}
                defaultErrorMessage="Invalid Phone Number"
                onChange={(e) => setPhone(e)}
                inputProps={{
                  name: 'phone',
                  className: 'phnInput',
                  autoFocus: false,
                }}
              />
              {error && phone.length < 11 ? (
                <FormHelperText>
                  Phone Number is of Invalid format.
                </FormHelperText>
              ) : (
                ''
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl
              required
              error={error && firstname.trim() === ''}
              className={classes.formControl}
            >
              <InputLabel htmlFor="name">FirstName</InputLabel>
              <Input
                id="name"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                onKeyPress={(e) => {
                  if (
                    e.target.value.length >= 15
                    || !checkAlphabetsWithDotAndSpace(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="name">MiddleName</InputLabel>
              <Input
                id="name"
                type="text"
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                onKeyPress={(e) => {
                  if (
                    e.target.value.length >= 15
                    || !checkAlphabetsWithDotAndSpace(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl
              required
              error={error && lastname.trim() === ''}
              className={classes.formControl}
            >
              <InputLabel htmlFor="name">LastName</InputLabel>
              <Input
                id="name"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                onKeyPress={(e) => {
                  if (
                    e.target.value.length >= 15
                    || !checkAlphabetsWithDotAndSpace(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              required
              error={error && !checkPasswordValidity(password)}
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
                <InfoPopoverContent password={password} />
              </Popover>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
              {password ? (
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
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomDropdown
              label="Role"
              options={roleOptions}
              value={role}
              handleChange={handleChangeRole}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.button}
          onClick={handleBack}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          onClick={handleRegister}
          color="primary"
        >
          {'Sign Up'}
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
    padding: theme.spacing(1, 3, 1, 3),
    background: '#f7f7f7',
    border: '3px solid #3f51b5',
    borderRadius: '20px',
    boxShadow: '0 0 3px 3px #EEEEEE',
    maxWidth: 700,
  },
}))(MuiDialog);

const Grid = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
  },
}))(MuiGrid);

const useStyles = makeStyles((theme) => ({
  mt2: {
    marginTop: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(1, 1.5),
  },
  title: {
    color: '#3f51b5',
    fontSize: 38,
    fontWeight: 600,
    textAlign: 'center',
  },
  formControl: {
    width: '100%',
  },
  button: {
    fontSize: 20,
    fontWeight: 600,
  },
  fullWidth: {
    width: '100%',
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

SignUpModal.propTypes = {
  handleSignUp: PropTypes.func,
  handleCancel: PropTypes.func,
  showToast: PropTypes.func.isRequired,
};

SignUpModal.defaultProps = {
  handleSignUp: () => {},
  handleCancel: () => {},
};

export default SignUpModal;
