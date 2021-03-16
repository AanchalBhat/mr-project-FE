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
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/styles';
import MuiGrid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PhoneInput from 'react-phone-input-2';
import { fullRoles, roles } from '../../utils/constant';
import CustomDropdown from '../dropdown';
import 'react-phone-input-2/lib/style.css';
import { Axios } from '../../utils/axios';

import {
  checkEmail,
  checkAlphabetsWithDotAndSpace,
  checkAphaNumeric,
} from '../../utils/regex';
import MultiSelect from '../multiselect';


const UserCreationModal = (props) => {
  const { handleCreateUser, handleCancel, showToast, open, userRole } = props;

  const classes = useStyles();

  const [error, setError] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [officeSymbol, setOfficeSymbol] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [role, setRole] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [agencyCode, setAgencyCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const agency_name = useMemo(
    () => ({
      options: agencies,
      freeSolo: true,
      getOptionLabel: (option) => option.Agency_Name,
    }),
    [agencies],
  );

  const roleOptions = userRole === 'Super Admin' ? fullRoles : roles
  /* const roleOptions = useMemo(
    () => userRoles.map((r) => ({
      value: r.split(' ').join('_'),
      label: r,
    })),
    [],
  ); */

  const user = useMemo(
    () => ({
      agency_code: agencyCode,
      phone,
      organization: orgName,
      office_symbol: officeSymbol,
      firstname,
      middlename,
      lastname,
      email,
      role,
    }),
    [
      agencyCode,
      phone,
      orgName,
      officeSymbol,
      firstname,
      middlename,
      lastname,
      email,
      role,
    ],
  );

  const checkValidity = () => {
    const agencyCode = disabled ? user.agency_code.length >= 4 : true;
    const officeSymbol = disabled ? user.office_symbol.trim() !== '' : true;
    return (
        checkEmail(user.email)
        && user.phone.length >= 11
        && user.firstname.trim() !== ''
        && user.lastname.trim() !== ''
        && user.organization.trim() !== ''
        && agencyCode
        && officeSymbol
        && role.length > 0
    );
  };

  const handleRegister = () => {
    setError(false);
    if (checkValidity()) {
      Axios.post('/user/create', {...user, role: JSON.stringify(user.role) })
        .then((res) => {
          if (res.data.status) {
            showToast({
              type: 'success',
              message: 'You have created user account successfully!',
            });
            handleCancel();
          } else {
            showToast({
              type: 'error',
              message: res.data.message,
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

  const handleChangeRole = (event) => {
    setRole(event.target.value);
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

  const onClose = () => {
    setAgencyCode('')
    setOrgName('')
    setPhone('')
    setOfficeSymbol('')
    setFirstname('')
    setMiddlename('')
    setLastname('')
    setEmail('')
    setRole([])
    handleCancel()
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle>
        <Typography className={classes.title}>Market Research Tool</Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid container spacing={3} className={classes.fullWidth}>
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

          <Grid item xs={12} md={6}>
            {/* <CustomDropdown
              label="Role"
              options={roleOptions}
              value={role}
              handleChange={handleChangeRole}
            /> */}
            <MultiSelect
              label='Role'
              options={roleOptions}
              value={role}
              error={error && role.length ===0}
              handleChange={handleChangeRole}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          className={classes.button}
          onClick={onClose}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          onClick={handleRegister}
          color="primary"
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(1, 3, 1, 3),
    background: '#f7f7f7',
    border: '3px solid #3f51b5',
    borderRadius: '20px',
    boxShadow: '0 0 3px 3px #EEEEEE',
    maxWidth: 700
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

UserCreationModal.propTypes = {
  handleCreateUser: PropTypes.func,
  handleCancel: PropTypes.func,
  showToast: PropTypes.func.isRequired,
};

UserCreationModal.defaultProps = {
  handleCreateUser: () => {},
  handleCancel: () => {},
};

export default UserCreationModal;
