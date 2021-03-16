import React, { useState, useEffect } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { add_evaluation } from "../../redux/actions/sce";

import NumberFormatCustom from "./../../components/inputs/NumberMask";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Slide,
  withStyles,
  Typography,
  InputAdornment,
  TextField,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";

import { CheckCircle, Cancel } from "@material-ui/icons";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import CustomTable from "../../components/table";
import MuiDialog from "@material-ui/core/Dialog";
import MuiGrid from "@material-ui/core/Grid";

import Autocomplete from "@material-ui/lab/Autocomplete";

import SignatureCanvas from "react-signature-canvas";

import { Axios } from "../../utils/axios";

import MaskedInput from "react-text-mask";

import {
  checkAlphabetsWithDotAndSpace,
  checkEmail,
  checkNumberOnly,
} from "../../utils/regex";

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: "#f7f7f7",
    border: "3px solid #3f51b5",
    borderRadius: "20px",
    boxShadow: "0 0 3px 3px #EEEEEE",
    width: "90%",
    height: "80%",
    maxWidth: 1200,
  },
}))(MuiDialog);

const AwkDialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      keepCharPositions={false}
      // showMask
    />
  );
};

const SubContracterPerformance = (props) => {
  const EMPTY_FORM_DATA = {
    sc_duns_no: "",
    sc_name: "",
    sc_address: "",
    sc_phone: "",
    pc_number: "",
    sc_value: "",
    sc_value_status: null,
    sc_value_actual: "",
    contract_period_start: null,
    contract_period_end: null,
    contract_agency: "",
    poc: "",
    pc_phone: "",
    doe: "",
    rating: [
      {
        type: "quality",
        label: "Quality of the Product/Service",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
      {
        type: "problem resolution",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
      {
        type: "cost control",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
      {
        type: "timelines",
        label: "Timeliness of Performance",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
      {
        type: "business relations",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
      {
        type: "customer service",
        rating: 0,
        comments: "",
        status: null,
        actual: "",
      },
    ],
    total_rating: "",
    agency_org: props.user.organization,
    eval_name: "",
    eval_phone: "",
    eval_signature: "",
    eval_date: new Date(),
    userId: props.user.userId,
  };

  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.store_data);
  }, [props.store_data]);

  const [open, setOpen] = useState(false);

  const [disabled, setDisabled] = useState(true);

  const onClickId = (sc_duns_no) => {
    setFormData({
      ...data.find((row) => row.sc_duns_no === sc_duns_no),
      sc_duns_no: "" + sc_duns_no,
    });
    setDisabled(true);
    setOpen(true);
  };

  const columns = [
    {
      title: "Sub-Contractor Duns No.",
      field: "sc_duns_no",
      cellStyle: {
        cursor: "pointer",
      },
      render: (rowData) => (
        <span onClick={() => onClickId(rowData.sc_duns_no)}>
          {rowData.sc_duns_no}
        </span>
      ),
    },
    { title: "Sub-Contractor Name", field: "sc_name" },
    { title: "Contract Number", field: "pc_number" },
    {
      title: "Evaluation Status",
      field: "status",
      render: (rowdata) => <span>{rowdata.status || "Pending"}</span>,
    },
  ];

  const [formData, setFormData] = useState(Object.assign({}, EMPTY_FORM_DATA));

  const [awkOpen, setAwkOpen] = useState(false);

  const handleClickOpen = () => {
    setFormData(Object.assign({}, EMPTY_FORM_DATA));
    setDisabled(false);
    setOpen(true);
    setError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let sigCanvas = null;

  const [dunsList, setDunsList] = useState([]);
  const [nameList, setNameList] = useState([]);

  const [samLockDuns, setSamLockDuns] = useState(false);
  const [samLockName, setSamLockName] = useState(false);

  const numberProps = {
    options: dunsList,
    disabled: disabled || samLockDuns,
    getOptionLabel: (option) => option.duns_no,
    freeSolo: false,
    onChange: (event, newValue) => {
      setLoading(true);
      setFormData({
        ...formData,
        sc_name: newValue ? newValue.duns_name : "",
        sc_duns_no: newValue ? newValue.duns_no : "",
        sc_address: newValue ? newValue.addr : "",
        sc_phone: newValue ? newValue.phone : "",
      });
      setSamLock(true);
      setSamLockName(true);
      setLoading(false);
      if (!newValue) {
        setDunsList([]);
        setSamLockName(false);
        setSamLock(false);
      }
    },
    onKeyPress: (e) => {
      if (!checkNumberOnly(e.key)) {
        e.preventDefault();
      }
    },
    autoHighlight: true,
    autoSelect: true,
    clearOnBlur: false,
    inputValue: formData.sc_duns_no,
    onInputChange: (event, newInputValue) => {
      if (newInputValue.length === 3) {
        Axios.get("/sub-contractor/autocomplete-list?DUNS=" + newInputValue)
          .then((response) => {
            setDunsList(response.data);
          })
          .catch((err) => {
            console.log(err);
            alert("error");
          });
      } else if (newInputValue.length === 2) {
        setDunsList([]);
      }
      setFormData({ ...formData, sc_duns_no: newInputValue });
    },
    renderInput: (params) => (
      <TextField
        {...params}
        required
        error={error && formData.sc_duns_no === ""}
        type="text"
        label="Sub-Contractor DUNS No."
        margin="none"
      />
    ),
  };

  const nameProps = {
    options: nameList,
    freeSolo: false,
    disabled: disabled || samLockName,
    getOptionLabel: (option) => {
      if (typeof option === "string") {
        return "";
      } else {
        return option.duns_name;
      }
    },
    onChange: (event, newValue) => {
      setLoading(true);
      setFormData({
        ...formData,
        sc_name: newValue ? newValue.duns_name : "",
        sc_duns_no: newValue ? newValue.duns_no : "",
        sc_address: newValue ? newValue.addr : "",
        sc_phone: newValue ? newValue.phone : "",
      });
      setSamLock(true);
      setSamLockDuns(true);
      setLoading(false);
      if (!newValue) {
        setNameList([]);
        setSamLock(false);
        setSamLockDuns(false);
      }
    },
    autoHighlight: true,
    autoSelect: true,
    clearOnBlur: false,
    inputValue: formData.sc_name,
    onInputChange: (event, newInputValue) => {
      if (newInputValue.length === 3) {
        Axios.get(
          "/sub-contractor/autocomplete-list?LEGAL_BUSINESS_NAME=" +
            newInputValue
        )
          .then((response) => {
            setNameList(response.data);
          })
          .catch((err) => {
            console.log(err);
            alert("error");
          });
      } else if (newInputValue.length === 2) {
        setNameList([]);
      }
      setFormData({ ...formData, sc_name: newInputValue });
    },
    renderInput: (params) => (
      <TextField
        {...params}
        required
        onKeyPress={(e) => {
          if (e.which === 13) e.preventDefault();
        }}
        error={error && formData.sc_name === ""}
        label="Sub-Contractor Vendor's Name"
        margin="none"
      />
    ),
  };

  const [loading, setLoading] = useState(false);

  const [samLock, setSamLock] = useState(false);

  const [noEmail, setNoEmail] = useState(false);

  const [noEmailError, setNoEmailError] = useState(false);

  const [noEmailValue, setNoEmailValue] = useState("");

  const [error, setError] = useState(false);

  const [sign, setSign] = useState(false);

  const onSignature = () => {
    const signatureData = sigCanvas.toDataURL("image/jpeg", 1);
    setFormData({ ...formData, eval_signature: signatureData });
    setSign(true);
  };

  const checkValidity = () => {
    return (
      formData.sc_duns_no === "" ||
      formData.sc_name === "" ||
      formData.contract_period_start === null ||
      formData.contract_period_end === null ||
      formData.sc_value === "" ||
      formData.pc_number === "" ||
      formData.poc === "" ||
      formData.agency_org === "" ||
      formData.eval_name === "" ||
      formData.contract_agency.length < 4 ||
      formData.eval_phone.trim().length < 14 ||
      (!samLock &&
        formData.sc_phone.trim().length > 0 &&
        formData.sc_phone.trim().length < 14) ||
      !sign
    );
  };

  const [mailValue, setMailValue] = useState("");
  const handleSave = () => {
    const validate = checkValidity();
    if (
      !validate &&
      window.confirm(
        "On submitting the record you won't be able to edit it and we will notify the sub-contractor about your evaluation. Are you sure you want to continue?"
      )
    ) {
      setFormData({
        ...formData,
        total_rating: formData.rating.reduce((a, i) => a + i.rating, 0),
      });
      setError(false);
      setLoading(true);
      Axios.post("/sub-contractor", { ...formData })
        .then((response) => {
          props.add_evaluation(Object.assign({}, formData));
          setData(data.concat(Object.assign({}, formData)));
          if (response.hasOwnProperty("error")) {
            alert(response.error);
          }
          handleClose();
          setLoading(false);
          setNoEmail(!response.data.subEmail);
          if (!response.data.subEmail) {
            setMailValue(response.data.email);
          }
          setTimeout(() => {
            setAwkOpen(true);
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          alert("Error");
          setLoading(false);
        });
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      {props.user.role === "Prime Contractor" ? (
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          + Add New Evaluation
        </Button>
      ) : (
        ""
      )}
      <CustomTable
        title="Sub-Contractor Performance Evaluations"
        columns={columns}
        data={data}
        addRow={false}
        editRow={false}
        deleteRow={false}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-slide-title">
          {"Add Sub-Contractor Performance Evaluation"}
        </DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl required className={classes.formControl}>
                  <Autocomplete {...nameProps} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl required className={classes.formControl}>
                  <Autocomplete {...numberProps} />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Sub-Contractor Address
                  </InputLabel>
                  <Input
                    disabled={disabled || samLock}
                    type="text"
                    value={formData.sc_address}
                    onChange={(e) =>
                      setFormData({ ...formData, sc_address: e.target.value })
                    }
                    multiline
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl
                  error={
                    error &&
                    !samLock &&
                    formData.sc_phone.trim().length > 0 &&
                    formData.sc_phone.trim().length < 14
                  }
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">
                    Sub-Contractor Phone No.
                  </InputLabel>
                  <Input
                    disabled={disabled || samLock}
                    value={formData.sc_phone}
                    onChange={(e) => {
                      setFormData({ ...formData, sc_phone: e.target.value });
                    }}
                    inputComponent={TextMaskCustom}
                    startAdornment={
                      <InputAdornment position="start">+1</InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={formData.sc_value_status === null ? 8 : 4}>
                <FormControl
                  required
                  error={error && formData.sc_value === ""}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">
                    Sub-Contractor Amount Paid
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    value={formData.sc_value}
                    onChange={(e) =>
                      !disabled
                        ? setFormData({
                            ...formData,
                            sc_value: e,
                            sc_value_actual: e,
                          })
                        : ""
                    }
                    inputComponent={NumberFormatCustom}
                    endAdornment={
                      formData.sc_value_status !== null ? (
                        <InputAdornment>
                          {formData.sc_value_status === true ? (
                            <CheckCircle style={{ color: "green" }} />
                          ) : (
                            <Cancel color="secondary" />
                          )}
                        </InputAdornment>
                      ) : null
                    }
                  />
                </FormControl>
              </Grid>
              {formData.sc_value_status !== null ? (
                <Grid item xs={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="source-summary">
                      Sub-Contractor Amount Recieved
                    </InputLabel>
                    <Input
                      disabled={disabled}
                      type="nummber"
                      value={formData.sc_value_actual}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl
                  required
                  error={error && formData.pc_number === ""}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">
                    Prime Contract Number
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.pc_number}
                    onChange={(e) => {
                      if (e.target.value.length <= 18)
                        setFormData({ ...formData, pc_number: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  required
                  error={error && formData.poc === ""}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">
                    Prime Contract Officer
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.poc}
                    onChange={(e) => {
                      if (
                        checkAlphabetsWithDotAndSpace(e.target.value) &&
                        e.target.value.length <= 30
                      ) {
                        setFormData({ ...formData, poc: e.target.value });
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <MuiPickersUtilsProvider
                    className={classes.formControl}
                    utils={DateFnsUtils}
                  >
                    <KeyboardDatePicker
                      margin="none"
                      disabled={disabled}
                      animateYearScrolling={true}
                      disableFuture={true}
                      required={true}
                      error={error && formData.contract_period_start === null}
                      id="date-picker-dialog-ps"
                      label="Subcontractor Period of Performance - Start"
                      format="MM/dd/yyyy"
                      value={formData.contract_period_start}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          contract_period_start: date,
                        })
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <MuiPickersUtilsProvider
                    className={classes.formControl}
                    utils={DateFnsUtils}
                  >
                    <KeyboardDatePicker
                      margin="none"
                      disabled={disabled}
                      required={true}
                      error={error && formData.contract_period_end === null}
                      animateYearScrolling={true}
                      disableFuture={true}
                      id="date-picker-dialog-pe"
                      label="Subcontractor Period of Performance - End"
                      format="MM/dd/yyyy"
                      value={formData.contract_period_end}
                      onChange={(date) =>
                        setFormData({ ...formData, contract_period_end: date })
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  required
                  error={error && formData.contract_agency.length < 4}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">Agency Code</InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.contract_agency}
                    onChange={(e) => {
                      if (e.target.value.length <= 6)
                        setFormData({
                          ...formData,
                          contract_agency: e.target.value,
                        });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Description of Equipment / Services
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.doe}
                    onChange={(e) => {
                      if (e.target.value.length <= 150)
                        setFormData({ ...formData, doe: e.target.value });
                    }}
                    multiline
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <Typography
                    component="legend"
                    className="MuiTypography-colorTextSecondary"
                  >
                    RATINGS
                  </Typography>
                  <hr />
                  {formData.rating.map((item) => {
                    return (
                      <Grid key={item.type} container spacing={1}>
                        <Grid
                          item
                          xs={3}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Typography
                            component="legend"
                            className="MuiTypography-colorTextSecondary"
                          >
                            {item.label
                              ? item.label.toUpperCase()
                              : item.type.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={disabled ? 1 : 3}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          {[0, 1, 2, 3, 4]
                            .filter(
                              (index) =>
                                !disabled || (disabled && index === item.rating)
                            )
                            .map((index) => {
                              return (
                                <span
                                  key={"rating-" + index}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "1px solid #3f51b5",
                                    color:
                                      index === item.rating
                                        ? "#fff"
                                        : "#3f51b5",
                                    background:
                                      index === item.rating
                                        ? "#3f51b5"
                                        : "#fff",
                                    borderRadius: "50%",
                                    fontSize: "16px",
                                    padding: "2px",
                                    display: "inline-block",
                                    margin: "2px",
                                    textAlign: "center",
                                    cursor: disabled ? "unset" : "cursor",
                                    transition: "all 300ms ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = "#3f51b5";
                                    e.target.style.color = "#FFF";
                                  }}
                                  onMouseLeave={(e) => {
                                    if (index !== item.rating) {
                                      e.target.style.background = "#fff";
                                      e.target.style.color = "#3f51b5";
                                    }
                                  }}
                                  onClick={(e) => {
                                    if (!disabled) {
                                      setFormData({
                                        ...formData,
                                        rating: formData.rating.map((i) => {
                                          if (i.type === item.type) {
                                            i.rating = index;
                                          }
                                          return i;
                                        }),
                                      });
                                    }
                                  }}
                                >
                                  {index}
                                </span>
                              );
                            })}
                        </Grid>
                        <Grid
                          item
                          xs={disabled ? (item.status === null ? 8 : 4) : 6}
                        >
                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="source-summary">
                              Comments
                            </InputLabel>
                            <Input
                              disabled={disabled}
                              type="text"
                              value={item.comments}
                              onChange={(e) => {
                                if (e.target.value.length <= 150) {
                                  setFormData({
                                    ...formData,
                                    rating: formData.rating.map((i) => {
                                      if (i.type === item.type) {
                                        i.comments = e.target.value;
                                      }
                                      return i;
                                    }),
                                  });
                                }
                              }}
                              multiline
                              endAdornment={
                                item.status !== null ? (
                                  <InputAdornment>
                                    {item.status === true ? (
                                      <CheckCircle style={{ color: "green" }} />
                                    ) : (
                                      <Cancel color="secondary" />
                                    )}
                                  </InputAdornment>
                                ) : null
                              }
                            />
                          </FormControl>
                        </Grid>
                        {item.status !== null ? (
                          <Grid item xs={item.status === null ? 8 : 4}>
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="source-summary">
                                Comments
                              </InputLabel>
                              <Input
                                disabled={disabled}
                                type="text"
                                value={
                                  item.status ? item.comments : item.actual
                                }
                                multiline
                              />
                            </FormControl>
                          </Grid>
                        ) : (
                          ""
                        )}
                      </Grid>
                    );
                  })}
                  <FormHelperText id="source-summary">
                    Summarize sub-contractor performance and check the box
                    corresponding to the performance rating for each category.
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">Total Rating</InputLabel>
                  <Input
                    disabled
                    type="number"
                    value={formData.rating.reduce((a, i) => a + i.rating, 0)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_rating: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  required
                  error={error && formData.agency_org === ""}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">
                    Agency/Organization
                  </InputLabel>
                  <Input
                    disabled={true}
                    type="text"
                    value={formData.agency_org}
                    onKeyPress={(e) => {
                      if (!checkAlphabetsWithDotAndSpace(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      if (e.target.value.length <= 40)
                        setFormData({
                          ...formData,
                          agency_org: e.target.value,
                        });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} container>
                <Grid item xs={12}>
                  <FormControl
                    required
                    error={error && formData.eval_name === ""}
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="source-summary">
                      Evaluator Name
                    </InputLabel>
                    <Input
                      disabled={disabled}
                      type="text"
                      value={formData.eval_name}
                      onChange={(e) => {
                        if (
                          checkAlphabetsWithDotAndSpace(e.target.value) &&
                          e.target.value.length <= 30
                        ) {
                          setFormData({
                            ...formData,
                            eval_name: e.target.value,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    error={error && formData.eval_phone.trim().length < 14}
                    required
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="source-summary">
                      Evaluator Phone No.
                    </InputLabel>
                    <Input
                      disabled={disabled}
                      value={formData.eval_phone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          eval_phone: e.target.value,
                        });
                      }}
                      inputComponent={TextMaskCustom}
                      startAdornment={
                        <InputAdornment position="start">+1</InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <MuiPickersUtilsProvider
                      className={classes.formControl}
                      utils={DateFnsUtils}
                    >
                      <KeyboardDatePicker
                        margin="none"
                        disabled={true}
                        animateYearScrolling={true}
                        disableFuture={true}
                        id="date-picker-dialog"
                        label="Evaluation Date"
                        format="MM/dd/yyyy"
                        value={formData.eval_date}
                        onChange={(date) =>
                          setFormData({ ...formData, eval_date: date })
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  required
                  error={error && !sign}
                  className={classes.formControl}
                >
                  <InputLabel htmlFor="source-summary">Signature</InputLabel>
                  <SignatureCanvas
                    penColor="black"
                    onEnd={onSignature}
                    ref={(ref) => {
                      sigCanvas = ref;
                      if (sigCanvas) {
                        if (formData.eval_signature === "") {
                          sigCanvas.clear();
                        }
                        if (
                          sigCanvas.toDataURL("image/jpeg", 1) !==
                          formData.eval_signature
                        ) {
                          // sigCanvas.clear();
                          sigCanvas.fromDataURL(formData.eval_signature);
                        }
                        if (disabled) {
                          sigCanvas._canvas.style.pointerEvents = "none";
                        } else {
                          sigCanvas._canvas.style.pointerEvents = "unset";
                        }
                      }
                    }}
                    clearOnResize={false}
                    backgroundColor="rgba(255,255,255,1)"
                    canvasProps={{ height: 200, className: "sigCanvas" }}
                  />
                  {!disabled ? (
                    <FormHelperText id="source-summary">
                      Please sign in the above space with your mouse.
                      <span
                        onClick={(e) =>
                          setFormData({ ...formData, eval_signature: "" })
                        }
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Click Here
                      </span>{" "}
                      to reset the pad.
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </form>
          {!disabled ? (
            <>
              <br />
              <br />
              <br />
              <br />
              <Typography
                style={{ textAlign: "center" }}
                variant="h4"
                component="legend"
              >
                RATING GUIDELINES
              </Typography>
              <hr />
              <dl>
                <dt>Quality of Product or Service</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>
                          Nonconformance jeopardizes the achievement of contract
                          goals; default.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>
                          Nonconformance requires major agency intervention to
                          ensure achievement of contract goals; show cause or
                          cure notices
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>
                          Quality meets specifications in most cases, however,
                          some agency intervention required to ensure
                          achievement of contract requirements.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>Quality meets specifications in all cases.</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>Quality exceeds specifications in some cases.</dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
              <dl>
                <dt>Problem Resolution</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>
                          Inadequately resolved problems jeopardize contract
                          goals.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>
                          Significant agency intervention required to resolve
                          problems jeopardizing contract goals.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>
                          Some agency intervention required to resolve problems
                          jeopardizing contract goals.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>
                          Successfully overcomes or resolves all problems and
                          achieves contract goals with minimal agency
                          intervention.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>
                          Anticipate and avoids most problems and successfully
                          overcomes all unforeseen problems.
                        </dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
              <dl>
                <dt>Cost Control</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>
                          Cost increases jeopardize achievement of contract
                          goals; or billings routinely include unallowable
                          costs.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>
                          Significant cost increases; or some inaccurate
                          billings including some with unallowable costs.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>
                          Minor cost increases; or some inaccurate billings, but
                          a minimal (1-2) number of unallowable costs.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>
                          Contractor performed within cost; but some late
                          billings, none with unallowable costs.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>
                          Costs were less than the amount cited in the contract;
                          and billings accurate and timely.
                        </dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
              <dl>
                <dt>Timeliness of Performance</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>
                          Delays jeopardize the achievement of contract goals
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>Significant delays.</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>Minor delays</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>All deliverables on time.</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>
                          All deliverables on time with some ahead of schedule;
                          or stays on schedule despite unforeseen circumstances.
                        </dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
              <dl>
                <dt>Business Relations</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>Unethical or illegal business practices.</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>
                          Business practices are not attuned to customer
                          support.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>
                          Business practices are somewhat attuned to customer
                          support.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>Business practices focus on customer support.</dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>
                          Highly effective, proactive business practices focused
                          on customer support.
                        </dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
              <dl>
                <dt>Customer Service</dt>
                <dd>
                  <ol start="0">
                    <li>
                      <dl>
                        <dt>Unsatisfactory</dt>
                        <dd>
                          Response to service requests is routinely late,
                          ineffective or rude; customers express frustration or
                          anger about many interactions; complaints are
                          unresolved; contractor seems unaware of service
                          issues.Response to service requests is routinely late,
                          ineffective or rude; customers express frustration or
                          anger about many interactions; complaints are
                          unresolved; contractor seems unaware of service
                          issues.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Poor</dt>
                        <dd>
                          Response to service requests is often late,
                          ineffective or rude; some complaints are resolved.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Fair</dt>
                        <dd>
                          Response to service requests is uneven in timing or
                          effectiveness; customer interactions are tenuous;
                          contractor is trying hard and understands service
                          issues.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Good</dt>
                        <dd>
                          Response to service requests is timely; effective and
                          courteous; customers express positive feedback;
                          delivery of services is smooth and organized; collects
                          customer feedback; customer problems are resolved
                          well.
                        </dd>
                      </dl>
                    </li>
                    <li>
                      <dl>
                        <dt>Excellent</dt>
                        <dd>
                          Response to service requests is timely, effective and
                          courteous; the contractor is proactive in building
                          good relations with customers, proposing new service
                          strategies, analyzing and reporting on service loads
                          and collecting and using customer feedback
                        </dd>
                      </dl>
                    </li>
                  </ol>
                </dd>
              </dl>
            </>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {disabled ? "Close" : "Cancel"}
          </Button>
          {!disabled ? (
            <Button onClick={handleSave} color="primary">
              Submit
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Dialog>
      <AwkDialog open={awkOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Thank You</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank for submitting your Evaluation. We will go ahead and let the
            Sub-Contractor know about your entry.
          </DialogContentText>
          {noEmail ? (
            <>
              <DialogContentText>
                There is no Contact information about the Sub-Contractor with us
                Can you please share the email of the Sub-Contractor so we can
                notify them.
              </DialogContentText>
              <TextField
                error={noEmailError && !checkEmail(noEmailValue)}
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                value={noEmailValue}
                onChange={(e) => setNoEmailValue(e.target.value)}
              />
            </>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (noEmail) {
                if (!checkEmail(noEmailValue)) {
                  setNoEmailError(true);
                } else {
                  Axios.post("/sub-contractor/send-email", {
                    to_email: noEmailValue,
                    email: mailValue,
                  })
                    .then((response) => {
                      setNoEmail(false);
                      setNoEmailError(false);
                      setNoEmailValue("");
                      setAwkOpen(false);
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Error In Sending Email.");
                      setNoEmail(false);
                      setNoEmailError(false);
                      setNoEmailValue("");
                      setAwkOpen(false);
                    });
                }
              } else {
                setAwkOpen(false);
                setNoEmail(false);
                setNoEmailError(false);
                setNoEmailValue("");
              }
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </AwkDialog>
      {/* {redirect.redirect ? <Redirect to={redirect.route} /> : ""} */}
    </>
  );
};

const mapStateToProps = (store) => ({
  store_data: store.sce,
  user: store.authData.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      add_evaluation,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubContracterPerformance);
