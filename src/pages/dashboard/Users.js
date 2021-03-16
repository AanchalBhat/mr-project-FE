import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import CustomTable from "../../components/table";
import { Axios } from "../../utils/axios";
import { Switch } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  Typography,
  FormHelperText,
  withStyles,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
// import Switch from 'react-input-switch';
import MuiDialog from "@material-ui/core/Dialog";
import MuiGrid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, blue } from '@material-ui/core/colors';
import PhoneInput from "react-phone-input-2";
import { bindActionCreators } from 'redux';

import CustomDropdown from "../../components/dropdown";
import UserCreationModal from "../../components/modals/UserCreationModal";

import { agencyCodes, roles } from "../../utils/constant";
import { showToast } from '../../redux/actions/toast';
import {
  checkAlphaOnly,
  checkAlphabetsWithDotAndSpace,
  checkAphaNumeric,
  checkEmail,
  checkAlphaWithEmptyChar,
} from "../../utils/regex";

import "react-phone-input-2/lib/style.css";
import MultiSelect from "../../components/multiselect";

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: "#f7f7f7",
    border: "3px solid #3f51b5",
    borderRadius: "20px",
    boxShadow: "0 0 3px 3px #EEEEEE",
    width: "70%",
    height: "70%",
    maxWidth: 1000,
  },
}))(MuiDialog);
const Grid = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
  },
}))(MuiGrid);
const useStyles = makeStyles((theme) => ({
  mb2: {
    marginBottom: theme.spacing(2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing(0.5),
  },
  formControl: {
    width: "100%",
  },
  fullWidth: {
    width: "100%",
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Users = (props) => {
  const { userInfo, showToast } = props;
  let [user, setUser] = useState([]);
  const [checked, setChecked] = useState(true);

  const sortString = (str1, str2) => {
    let s1 = "",
      s2 = "";
    if (str1 === str2) {
      return true;
    }
    if (str1.length > str2.length) {
      s1 = str1;
      s2 = str2;
    } else {
      s1 = str2;
      s2 = str1;
    }
    let i = 0;
    while (s1.charCodeAt(i) === s2.charCodeAt(i) && i < s1.length) i++;
    if (str1.length > str2.length) {
      return s1.charCodeAt(i) - s2.charCodeAt(i);
    } else if (i < s2.length) {
      return s2.charCodeAt(i) - s1.charCodeAt(i);
    } else {
      return true;
    }
  };

  const toggleChecked = (userData) => {
    setChecked((prev) => !prev);
    let data;
    if (userData.isActive === true) {
      data = {
        userId: userData.userId,
        isActive: false,
      };
    } else {
      data = {
        userId: userData.userId,
        isActive: true,
      };
    }
    Axios.post("user/disable", data)
      .then((res) => {
        tableRap && tableRap.onQueryChange();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const classes = useStyles();

  const onClickdelete = (e) => {
    // alert("Are you sure you want to delete this row?");
    const data = { _id: e._id };
    // alert(data)
    Axios.post("user/delete", data)
      .then((res) => {
        alert("deleted succesfully");
        tableRap && tableRap.onQueryChange();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      title: "Action",
      field: "action",
      render: (rowData) => (
        <>
          <EditIcon onClick={() => onClickedit(rowData)} />
          <DeleteIcon
            onClick={() => {
              if((rowData.isActive === true && rowData.role === 'System Admin'))
              {
                alert(`You can't delete the Active System Admin.`)
              }else{
              if (window.confirm("Are you sure to delete this user?")) {
                onClickdelete(rowData);
              }
            }
            }}
          />
        </>
      ),
    },
    {
      title: "User Status",
      field: "isActive",
      cellStyle: {
        cursor: "pointer",
      },
      render: (rowData) => (
        <FormControlLabel
          control={
            <Switch
              checked={rowData.isActive}
              color="primary"
              onChange={() =>
                toggleChecked({
                  userId: rowData.userId,
                  isActive: rowData.isActive,
                })
              }
            />
          }
        />
      ),
    },
    {
      title: "User ID",
      field: "userId",
      customSort: (a, b) =>
        sortString(a.userId.toLowerCase(), b.userId.toLowerCase()),
    },
    {
      title: "Name",
      field: "firstname",
      customSort: (a, b) =>
        sortString(a.firstname.toLowerCase(), b.firstname.toLowerCase()),
    },
    { title: "Agency code", field: "agency_code" },
    { title: "Organization name", field: "organization" },
    {
      title: "Office symbol",
      field: "office_symbol",
      customSort: (a, b) =>
        sortString(
          a.office_symbol.toLowerCase(),
          b.office_symbol.toLowerCase()
        ),
    },
    {
      title: "Email",
      field: "email",
      customSort: (a, b) =>
        sortString(a.email.toLowerCase(), b.email.toLowerCase()),
    },
    {
      title: "Phone",
      field: "phone",
      customSort: (a, b) =>
        sortString(a.phone.toLowerCase(), b.phone.toLowerCase()),
    },
    {
      title: "Role",
      field: "role",
      render: rowData => rowData.role.includes('[') ? JSON.parse(rowData.role).join(',\n') : rowData.role
    },
  ];
  const handleAgencyCodeValue = (value) => {
    setAgencyCode(value);
  };
  const handleBack = () => {
    setUserEditModal(false);
    // handleCancel();
  };

  const [role, setRole] = useState([]);
  const handleChangeRole = e => {
    setRole(e.target.value);
  };

  const editUser = () => {
    setError(false);
    delete docData['userId']
    if (checkValidity()) {
      setIsUploading(true)
      Axios.post("user/update", {...docData, role: JSON.stringify(docData.role)})
        .then((res) => {
          setIsUploading(false)
          if (res.data.status) {
            if (res.data.data.nModified) {
              showToast({ type: 'success', message: 'User has been updated successfully' })
              setUserEditModal(false);
              tableRap && tableRap.onQueryChange();
            } else {
              showToast({ type: 'success', message: 'User has already been updated' })
            }
          } else {
            showToast({ type: 'error', message: res.data.message })
          }
        })
        .catch((err) => {
          setIsUploading(false)
          console.log(err);
        });
    } else {
      setError(true);
    }
  };

  const [openUserEditModal, setUserEditModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [agencyCode, setAgencyCode] = useState("");
  const [officeSymbol, setOfficeSymbol] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(userInfo.phone);
  const [firstname, setFirstname] = useState(userInfo.firstname);
  const [lastname, setLastname] = useState(userInfo.lastname);
  const [middlename, setMiddlename] = useState(userInfo.middlename);
  const [organization, setValue] = React.useState("");
  const [organizationss, setOrganization] = useState(userInfo.organization);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [debounce, setDebounce] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [agencies, setAgencies] = useState([]);
  const [random, setRandom] = useState(Math.random());
  const [tableRap, setsetTableRap] = useState();
  const [disabled, setDisabled] = useState(false);
  const [uId, setUid]= useState('');
  const [errorMsg, setErrorMsg] = useState({
    fname: "",
    mname: "",
    lname: "",
  });

  const [openUserCreationModal, setOpenUserCreationModal] = useState(false)
  const [isUpdating, setIsUploading] = useState(false)

  const offset = 30;
  const docData = {
    _id:uId,
    userId: userId,
    email: email || user.email,
    agency_code: agencyCode || user.agency_code,
    phone: phone || user.phone,
    office_symbol: officeSymbol || user.office_symbol,
    firstname: firstname || user.firstname,
    middlename: middlename || user.middlename || "",
    lastname: lastname || user.lastname,
    role: role || user.role,
    organization: organization,
  };
  const agency_name = {
    options: agencies,
    getOptionLabel: (option) => option.Agency_Name,
  };

  //const [valued,setValued] = useState([])
  const getAgencies = async () => {
    Axios.get("/agency/all")
      .then((res) => {
        setAgencies(res.data.data);
      })
      .catch((err) => {
        console.info(err);
      });
  };
  const agency_values = agencies.map((agencies) => {
    //  setAgencyCode(agencies.Agency_ID)
    return agencies.Agency_Name;
  });

  const options = agency_values;

  const [inputValue, setInputValue] = React.useState("");
  const handleChangeAgencyCode = (event, value) => {
    setValue(value);

    if (value) {
      const agency_values = agencies.map((agencies) => {
        return agencies;
      });
      const agency_filter = agency_values.filter(
        ({ Agency_Name }) => Agency_Name === value
      );

      // setAgencyCode(value.Agency_ID);
      setAgencyCode(agency_filter[0].Agency_ID);
      setOrganization(value.Agency_Name);
    } else {
      setDisabled(false);
    }
  };
  const onClickedit = (data) => {
    setUid(data._id);
    setValue(data.organization);
    setUserId(data.userId);
    setEmail(data.email);
    setFirstname(data.firstname);
    setMiddlename(data.middlename);
    setLastname(data.lastname);
    setPhone(data.phone);
    setOfficeSymbol(data.office_symbol);
    // setOrganization(data.organization)
    setAgencyCode(data.agency_code);
    setRole(data.role.includes('[') ? JSON.parse(data.role) : [data.role]);

    setUserEditModal(true);
  };

  user = {
    phone: phone,
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    agency_code: agencyCode,
    email: email,
  };

  const [error, setError] = useState({
    fname: false,
    mname: false,
    lname: false,
  });

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

  const checkValidity = () => {
    // const agencyCode = disabled ? user.agency_code.length >= 4 : true
    const officeSymbol = disabled ? user.office_symbol !== "" : true;
    return (
      user.userId !== "" &&
      checkEmail(user.email) &&
      user.phone.length >= 11 &&
      checkAlphaOnly(user.firstname) &&
      checkAlphaOnly(user.lastname) &&
      checkAlphaWithEmptyChar(user.middlename) &&
      //agencyCode &&
      organization !== "" &&
      //  user.valueed !== '' &&
      officeSymbol
    );
  };

  useEffect(() => {
    getAgencies();
  }, []);

  useEffect(() => {
    checkNameValidation(firstname, "fname");
  }, [firstname]);

  useEffect(() => {
    checkNameValidation(lastname, "lname");
  }, [lastname]);

  useEffect(() => {
    checkNameValidation(middlename, "mname");
  }, [middlename]);

  const onChangePage = (event, v) => {
    setPage(event);

    if (offset * (page + 1) < usersCount) {
      getFilteredUsers();
    }
  };

  const onSearchChange = (event, v) => {
    if (debounce) clearTimeout(debounce);
    setDebounce(
      setTimeout(() => {
        setSearch(event);
      }, 1000)
    );
  };

  const onChangeRowsPerPage = (event, v) => {
    setPageSize(event);
  };

  const getFilteredUsers = () => {
    Axios.get(`user/search?page=${page + 1}&offset=${offset}&q=${search}`, {
      params: { agency_code: userInfo.agency_code },
    })
      .then((res) => {
        setData(res.data.data);
        setUsersCount(res.data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTableData = (query) =>
    new Promise((resolve, reject) => {
      let url = "user/search?";
      url += "agency_code=" + userInfo.agency_code;
      url += "&offset=" + query.pageSize;
      url += "&page=" + (query.page + 1);
      url += "&q=" + query.search;
      url += "&r=" + random;
      Axios.get(url).then((result) => {
        resolve({
          data: result.data.data,
          page: result.data.page - 1,
          totalCount: result.data.total,
        });
      });
    });

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpenUserCreationModal(true)}>
        + Create User
      </Button>
      <CustomTable
        title="Users"
        columns={columns}
        data={getTableData}
        pageSize={pageSize}
        tableRef={(Ref) => setsetTableRap(Ref)}
        onChangePage={(e, v) => onChangePage(e, v)}
        onChangeRowsPerPage={(e, v) => onChangeRowsPerPage(e, v)}
        onSearchChange={(e, v) => onSearchChange(e, v)}
      />

      <Dialog
        open={openUserEditModal}
        aria-labelledby="form-dialog-title"
        onClose={() => setUserEditModal(false)}
      >
        <DialogTitle>
          <Typography className={classes.licenseTitle}>Edit User</Typography>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Grid container spacing={3} className={classes.fullWidth}>
            <Grid item xs={12} md={6}>
              <FormControl
                className={classes.formControl}
                required
                error={error && userId === ""}
              >
                <InputLabel htmlFor="code">User Id</InputLabel>
                <Input
                  id="code"
                  type="text"
                  disabled={true}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={(e) => {
                    if (
                      (e.target.value.length === 0 && !checkAlphaOnly(e.key)) ||
                      e.target.value.length >= 20
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl required className={classes.formControl}>
                {/* <Autocomplete
              
                {...agency_name}
               
                id="organization_name"
                inputValue={organization}
                onChange={handleChangeAgencyCode}
                htmlFor="organization_name"
                onKeyPress={e => {
                  if (!checkAlphabetsWithDotAndSpace(e.key) || e.target.value.length >= 30) {
                    e.preventDefault()
                  }
                }}
                // renderInput={(params) => <TextField {...params} label="Agency Name" margin="none"/>}
                renderInput={(params) => <TextField   required error={error && user.organization === ''} {...params} label="Organization name"   margin="none" />}
                onInputChange={(e, newInput) => setValue(newInput)}
                // clearOnBlur={false}
                // freeSolo={false}
              
                />  */}
                <Autocomplete
                  id="organization_name"
                  htmlFor="organization_name"
                  value={organization}
                  onChange={handleChangeAgencyCode}
                  //  onChange={(event, newInputValue) => {
                  //  setValue(newInputValue);
                  //  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  options={options}
                  renderInput={(params) => (
                    <TextField
                      required
                      error={error && organization === ""}
                      {...params}
                      label="Organization name"
                      margin="none"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {/* */}
            <Grid item xs={12} md={6}>
              <FormControl
                className={classes.formControl}
                required
                error={error && agencyCode === ""}
              >
                <InputLabel htmlFor="agency-code">Agency code</InputLabel>
                <Input
                  id="agency_code"
                  name="agency_code"
                  value={agencyCode}
                  disabled={true}
                  onKeyPress={(e) => {
                    if (
                      e.target.value.length === 6 ||
                      !checkAphaNumeric(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => handleAgencyCodeValue(e.target.value)}
                  type="text"
                />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} md={6}>
            <FormControl className={classes.formControl}>
            <InputLabel htmlFor="office_symbol">Office symbol</InputLabel>
              <Input id="office_symbol" type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)} />
              * <Autocomplete
                {...agency_name}
                id="organization_name"
                onChange={handleChangeAgencyCode}
                htmlFor="organization_name"
                renderInput={(params) => <TextField {...params} label="Organization name" margin="normal" />}
                />     }
            </FormControl>
          </Grid> */}
            <Grid item xs={12} md={6}>
              <FormControl
                className={classes.formControl}
                required
                error={error && user.office_symbol === ""}
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
                className={classes.formControl}
                required
                error={error && !checkEmail(user.email)}
              >
                <InputLabel htmlFor="email">User email</InputLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={true}
                />
                {error && !checkEmail(user.email) === true ? (
                  <FormHelperText>Invalid Email</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                className={classes.formControl}
                error={error && user.phone.length < 11}
              >
                {
                  <PhoneInput
                    country="us"
                    mask="(999) 999-9999"
                    label="Phone1"
                    value={phone}
                    defaultErrorMessage={"Invalid Phone Number"}
                    onChange={(e) => setPhone(e)}
                    inputProps={{
                      name: "phone",
                      className: "phnInput",
                      autoFocus: false,
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
                className={classes.formControl}
                required
                error={!checkAlphaOnly(user.firstname) || firstname === ""}
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
                className={classes.formControl}
                error={
                  error &&
                  !checkAlphaOnly(user.middlename) &&
                  user.middlename !== ""
                }
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
                className={classes.formControl}
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
              <MultiSelect
                label="Role"
                isDisabled={role.length === 1 && role[0] === 'System Admin'}
                options={roles}
                value={role}
                handleChange={handleChangeRole}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
            <FormControl className={classes.formControl}>
              <ReactPasswordStrength 
                  className={classes.formControl} 
                  minLength={6} 
                  value={password}
                  changeCallback={e=> handlePasswordChange(e)}
                  placeholder="Password" 
                  inputProps={{  id: 'inputPassword1'}} 
                  scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
              />
            </FormControl>
          </Grid> */}
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
          <div className={classes.wrapper}>
            <Button className={classes.button} disabled={isUpdating} onClick={editUser} color="primary">
              Save
            </Button>
            {isUpdating && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
      <UserCreationModal
        open={openUserCreationModal}
        handleCancel={() => setOpenUserCreationModal(false)}
        showToast={showToast}
        userRole={userInfo.role}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return { userInfo: state.authData.user };
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    showToast,
  },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
