import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  TextField,
  FormHelperText,
  withStyles,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";

import MuiContainer from "@material-ui/core/Container";
import MuiGrid from "@material-ui/core/Grid";
import { bindActionCreators } from "redux";
import { login } from "../../redux/actions/auth";
import MuiNativeSelect from "@material-ui/core/NativeSelect";
import MuiDialog from "@material-ui/core/Dialog";
import classnames from "classnames";
import { Axios } from "../../utils/axios";
import { agencyCodes, roles } from "../../utils/constant";
import { connect } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkAlphaOnly, checkAlphaWithEmptyChar } from "../../utils/regex";
import TopBar from "../../components/topbar";
import { logOut } from "../../redux/actions/auth";

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: "#f7f7f7",
    border: "3px solid #3f51b5",
    borderRadius: "20px",
    boxShadow: "0 0 3px 3px #EEEEEE",
    minWidth: 400,
  },
}))(MuiDialog);

const Container = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiContainer);

const NativeSelect = withStyles((theme) => ({
  select: {
    paddingLeft: theme.spacing(0.5),
  },
}))(MuiNativeSelect);

const Grid = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
  },
}))(MuiGrid);

const useStyles = makeStyles((theme) => ({
  mt2: {
    marginTop: theme.spacing(2),
  },
  title: {
    fontSize: 50,
    fontWeight: 600,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.main,
    textAlign: "center",
    top: theme.spacing(4),
    // mixBlendMode: 'difference',
  },
  licenseTitle: {
    fontSize: 25,
    fontWeight: 600,
    color: theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
  },
  wrapper: {
    width: "100%",
    position: "absolute",
    // padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    width: "100%",
  },
  dropDown: {
    marginTop: "4px",
  },
  button: {
    fontSize: 20,
    fontWeight: 600,
    margin: theme.spacing(0, 2),
  },
  mrAuto: {
    marginLeft: "auto",
  },
  fullWidth: {
    width: "100%",
  },
}));

const ProfilePage = (props) => {
  const classes = useStyles();

  const { userInfo, logOut } = props;

  const handleLogOut = () => {
    logOut();
  };

  const [companySize, setCompanySize] = useState({
    value: "1",
    label: "1",
  });

  const agencyCodeOptions = agencyCodes.map((code) => ({
    value: code,
    label: code,
  }));

  const handlePasswordChange = (event) => {
    setPassword(event.password);
  };

  const [agencyReport, setAgencyReport] = useState(false);
  const handleAgencyReport = (event) => {
    setAgencyReport(event.target.checked);
  };
  console.log("userrrrr", userInfo.role);
  const roleOptions = roles.map((r) => ({
    value: r.split(" ").join("_"),
    label: r,
  }));
  const [role, setRole] = useState("System_Admin");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAgencies();
  }, []);

  const [agencyCode, setAgencyCode] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState(userInfo.phone);
  const [agencies, setAgencies] = useState([]);
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [lastname, setLastname] = useState(userInfo.lastname);
  const [middlename, setMiddlename] = useState(userInfo.middlename);
  const [firstname, setFirstname] = useState(userInfo.firstname);
  const [email, setEmail] = useState("");
  const [officeSymbol, setOfficeSymbol] = useState("");
  const [dunsNumber, setDunsNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState({
    fname: "",
    mname: "",
    lname: "",
  });

  const handleAgencyCodeValue = (value) => {
    setAgencyCode(value);
  };

  const handleChangeRole = (event) => {
    setRole(event);
  };

  const agency_name = {
    options: agencies,
    getOptionLabel: (option) => option.Agency_Name,
  };

  const getAgencies = async () => {
    Axios.get("/agency/all")
      .then((res) => {
        console.log(res);
        setAgencies(res.data.data);
      })
      .catch((err) => {
        console.info(err);
      });
  };
  const user = {
    phone: phone,
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
  };
  const [error, setError] = useState({
    fname: false,
    mname: false,
    lname: false,
  });
  const checkValidity = () => {
    const agencyCode = disabled ? user.agency_code.length >= 4 : true;
    console.log("user name", user.firstname);
    console.log("Test user validation", checkAlphaOnly(user.firstname));
    return (
      user.phone.length >= 11 &&
      checkAlphaOnly(user.firstname) &&
      checkAlphaOnly(user.lastname) &&
      checkAlphaWithEmptyChar(user.middlename) &&
      agencyCode
    );
  };
  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };
  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };
  const handleMiddlenameChange = (event) => {
    setMiddlename(event.target.value);
  };

  const checkNameValidation = (val, name) => {
    if (!checkAlphaOnly(val) || !val) {
      setError({ ...error, [name]: true });
      if (!val && name !== "mname")
        setErrorMsg({ ...errorMsg, [name]: "Required" });
      else if (!val && name == "mname") setErrorMsg(errorMsg);
      else
        setErrorMsg({
          ...errorMsg,
          [name]: "Special Characters are not allowed",
        });
    } else {
      setError({ ...error, [name]: false });
      setErrorMsg({ ...errorMsg, [name]: "" });
    }
  };

  useEffect(() => {
    checkNameValidation(firstname, "fname");
  }, [firstname]);

  useEffect(() => {
    checkNameValidation(lastname, "lname");
  }, [lastname]);

  useEffect(() => {
    checkNameValidation(middlename, "mname");
  }, [middlename]);
  
  const handleUpdateProfile = () => {
    setError(false);
    console.log(checkValidity());
    if (checkValidity()) {
      Axios.post("/user/profile/update", user)
        .then((res) => {
          console.log("data from api", res);
          if (res.data.data.nModified) {
            window.localStorage.setItem(
              "authUser",
              JSON.stringify({...userInfo,
                phone: user.phone,
                firstname: user.firstname,
                middlename: user.middlename,
                lastname: user.lastname})
            );
            Axios.defaults.headers.common = {
              Authorization: `Bearer ${user.token}`,
            };
            props.login({
              ...userInfo,
              phone: user.phone,
              firstname: user.firstname,
              middlename: user.middlename,
              lastname: user.lastname,
              
            });
            alert("profile updated succesfully");
          }
        })
        .catch((err) => {
          console.info(err);
        });
    } else {
      setError(true);
    }
  };

  const handleChangeAgencyCode = (event, value) => {
    console.log("Selected Value", value);
    if (value) {
      setAgencyCode(value.Agency_ID);
      setOrgName(value.Agency_Name);
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <TopBar handleLogout={handleLogOut} />
        <Typography className={classes.title}>User profile</Typography>
        <Container maxWidth="md">
          <Grid container spacing={3} className={classes.fullWidth}>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="code">User ID</InputLabel>
                <Input
                  id="code"
                  type="text"
                  value={userInfo.userId}
                  disabled={true}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  disabled={true}
                  {...agency_name}
                  id="organization_name"
                  inputValue={userInfo.organization}
                  onChange={handleChangeAgencyCode}
                  htmlFor="organization_name"
                  renderInput={(params) => (
                    <TextField {...params} label="Agency Name" margin="none" />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="agency-code">Agency code</InputLabel>
                <Input
                  id="agency_Code"
                  value={userInfo.agency_code}
                  disabled={true}
                  onChange={(e) => handleAgencyCodeValue(e.target.value)}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="office_symbol">Office symbol</InputLabel>
                <Input
                  id="office_symbol"
                  type="text"
                  value={userInfo.office_symbol}
                  disabled={true}
                  onChange={(e) => setOfficeSymbol(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="email">User email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  disabled={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel
                htmlFor="phone"
                style={{
                  position: "absolute",
                  fontSize: "0.8rem",
                  marginTop: "5px",
                }}
              >
                Phone
              </InputLabel>
              <FormControl
                required
                error={error && user.phone.length < 11}
                className={classes.formControl}
              >
                {
                  <PhoneInput
                    country="us"
                    mask="(999) 999-9999"
                    label="Phone1"
                    value={user.phone}
                    // value={phone}
                    defaultErrorMessage={"Invalid Phone Number"}
                    onChange={(e) => setPhone(e)}
                    inputProps={{
                      name: "phone",
                      className: "phnInput",
                      autoFocus: true,
                    }}
                  />
                }
                {error && user.phone.length < 11 ? (
                  <FormHelperText>
                    Phone Number is of Invalid format.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl
                required
                error={!checkAlphaOnly(user.firstname) || firstname === ""}
                className={classes.formControl}
              >
                <InputLabel htmlFor="name">FirstName</InputLabel>
                <Input
                  id="name"
                  type="text"
                  value={firstname}
                  onChange={(e) => {
                    handleFirstnameChange(e);
                    checkNameValidation(e.target.value, "fname");
                  }}
                  onKeyPress={(e) => {
                    if (e.target.value.length >= 15) {
                      e.preventDefault();
                    }
                  }}
                />
                {error["fname"] === true ? (
                  <FormHelperText> {errorMsg["fname"]} </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                error={
                  error &&
                  !checkAlphaOnly(user.middlename) &&
                  user.middlename !== ""
                }
                className={classes.formControl}
              >
                <InputLabel htmlFor="name">MiddleName</InputLabel>
                <Input
                  id="name"
                  type="text"
                  value={middlename}
                  onChange={(e) => {
                    handleMiddlenameChange(e);
                    checkNameValidation(e.target.value, "mname");
                  }}
                  onKeyPress={(e) => {
                    if (e.target.value.length >= 15) {
                      e.preventDefault();
                    }
                  }}
                />
                {error["mname"] === true && user.middlename !== "" ? (
                  <FormHelperText> {errorMsg["mname"]} </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                required
                error={!checkAlphaOnly(user.lastname) || lastname === ""}
                className={classes.formControl}
              >
                <InputLabel htmlFor="name">LastName</InputLabel>
                <Input
                  id="name"
                  type="text"
                  value={lastname}
                  onChange={(e) => {
                    handleLastnameChange(e);
                    checkNameValidation(e.target.value, "lname");
                  }}
                  onKeyPress={(e) => {
                    if (e.target.value.length >= 15) {
                      e.preventDefault();
                    }
                  }}
                />
                {error["lname"] === true ? (
                  <FormHelperText> {errorMsg["lname"]} </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Input
                  id="role"
                  type="text"
                  value={userInfo.role.includes('[') ? JSON.parse(userInfo.role).join(',') : userInfo.role}
                  disabled={true}
                />
              </FormControl>
              {/* <FormControl className={classnames(classes.formControl, classes.dropDown)}>	
              <CustomDropdown
                label="Role"
                options={roleOptions.value}
                value={userInfo.role}
                isDisabled={true}
              />
              </FormControl> */}
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.fullWidth}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                className={classes.mt2}
                control={
                  <Checkbox
                    disabled={true}
                    checked={agencyReport}
                    onChange={handleAgencyReport}
                    name="globalAgencyReport"
                    color="primary"
                  />
                }
                label="Agency Report"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.fullWidth}>
            <Button
              className={classnames(classes.button, classes.mrAuto)}
              color="primary"
              onClick={(event) => props.history.push("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={handleUpdateProfile}
            >
              Submit
            </Button>
          </Grid>
        </Container>
      </div>
    </>
  );
};

ProfilePage.propTypes = {
  isAdmin: PropTypes.bool,
};

ProfilePage.defaultProps = {
  isAdmin: false,
};
const mapStateToProps = (state) => {
  console.log(state.authData.user);
  return { userInfo: state.authData.user };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      login,
      logOut,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
