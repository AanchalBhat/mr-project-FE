import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { update_evaluation } from "../../redux/actions/sce";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  withStyles,
  Typography,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";

import NumberFormatCustom from "../../components/inputs/NumberMask";

import Background from "./../../assests/image_1.jpg";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";
import MuiDialog from "@material-ui/core/Dialog";
import MuiGrid from "@material-ui/core/Grid";

import { Axios } from "../../utils/axios";
import SignatureCanvas from "react-signature-canvas";

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    width: "90%",
    height: "80%",
    maxWidth: 1200,
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
}));

const SubContractorForm = ({ match, store_data, update_evaluation }) => {
  const EMPTY_FORM_DATA = {
    sc_duns_no: "",
    sc_name: "",
    sc_address: "",
    sc_phone: "",
    pc_number: "",
    sc_value: "",
    sc_value_status: null,
    sc_value_actual: "",
    contract_period_start: new Date(),
    contract_period_end: new Date(),
    contract_agency: "",
    poc: "",
    pc_phone: "",
    doe: "",
    rating: [
      {
        type: "quality",
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
    agency_org: "",
    eval_name: "",
    eval_phone: "",
    eval_signature: "",
    eval_date: new Date(),
  };

  const classes = useStyles();

  const [disabled] = useState(true);

  let sigCanvas = null;

  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const [showForm, setShowForm] = useState(false);

  const [signature, setSignature] = useState("");

  useEffect(() => {
    Axios.get("/sub-contractor?_id=" + match.params.id)
      .then((response) => {
        if (response.data[0].status === "Completed") {
          alert("Link you are trying to access has been expired.");
          window.location.replace("/");
        } else {
          setFormData(response.data[0]);
          setSignature(response.data[0].eval_signature);
          setShowForm(true);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
  }, [disabled]);

  const handleSave = () => {
    setShowForm(false);
    Axios.put("/sub-contractor", { ...formData })
      .then((response) => {
        if (response.data.hasOwnProperty("error")) {
          alert(response.data.error);
          window.location.reload();
        } else {
          alert(response.data.data);
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error");
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Backdrop className={classes.backdrop} open={!showForm}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={showForm}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Add Sub-Contractor Performance Evaluation"}
        </DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Sub-Contractor Name</InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.sc_name}
                    onChange={(e) =>
                      setFormData({ ...formData, sc_name: e.target.value })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Sub-Contractor DUNS No.</InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.sc_duns_no}
                    onChange={(e) =>
                      setFormData({ ...formData, sc_duns_no: e.target.value })
                    }
                  />
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
                    disabled={disabled}
                    type="text"
                    value={formData.sc_name_address}
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
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Sub-Contractor Phone No.
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.sc_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, sc_phone: e.target.value })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={formData.sc_value_status === null ? 8 : 4}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Sub-Contractor Amount Paid
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.sc_value}
                    inputComponent={NumberFormatCustom}
                    onChange={(e) => setFormData({ ...formData, sc_value: e })}
                    endAdornment={
                      formData.sc_value_status === null ? (
                        <InputAdornment position="end">
                          <Button
                            style={{ color: "green" }}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                sc_value_status: true,
                              });
                            }}
                          >
                            Concor
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                sc_value_status: false,
                              });
                            }}
                          >
                            Not Concur
                          </Button>
                        </InputAdornment>
                      ) : (
                        ""
                      )
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
                      error
                      disabled={formData.sc_value_status}
                      type="text"
                      value={formData.sc_value_actual}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sc_value_actual: e,
                        })
                      }
                      inputComponent={NumberFormatCustom}
                      endAdornment={
                        <InputAdornment position="end">
                          <Button
                            color="secondary"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                sc_value_actual: formData.sc_value,
                                sc_value_status: null,
                              });
                            }}
                          >
                            RESET
                          </Button>
                        </InputAdornment>
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
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Prime Contractor Number
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.pc_number}
                    onChange={(e) =>
                      setFormData({ ...formData, sc_number: e.target.value })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Prime Contract Officer
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.poc}
                    onChange={(e) =>
                      setFormData({ ...formData, poc: e.target.value })
                    }
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
                      id="date-picker-dialog"
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
                      animateYearScrolling={true}
                      disableFuture={true}
                      id="date-picker-dialog"
                      label="Subcontractor Period of Performance - End"
                      format="MM/dd/yyyy"
                      value={formData.contract_period_end}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          contract_period_end: date,
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
                <FormControl required className={classes.formControl}>
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
                    Description of Equipment
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.doe}
                    onChange={(e) =>
                      setFormData({ ...formData, doe: e.target.value })
                    }
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
                            {item.type.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
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
                                    cursor: "pointer",
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
                        <Grid item xs={item.status === null ? 8 : 4}>
                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="source-summary">
                              Comments
                            </InputLabel>
                            <Input
                              disabled={disabled}
                              type="text"
                              value={item.comments}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  rating: formData.rating.map((i) => {
                                    if (i.type === item.type) {
                                      i.comments = e.target.value;
                                    }
                                    return i;
                                  }),
                                });
                              }}
                              multiline
                              endAdornment={
                                item.status === null ? (
                                  <InputAdornment position="end">
                                    <Button
                                      style={{ color: "green" }}
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          rating: formData.rating.map((i) => {
                                            if (i.type === item.type) {
                                              i.status = true;
                                            }
                                            return i;
                                          }),
                                        });
                                      }}
                                    >
                                      Concor
                                    </Button>
                                    <Button
                                      color="secondary"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          rating: formData.rating.map((i) => {
                                            if (i.type === item.type) {
                                              i.status = false;
                                            }
                                            return i;
                                          }),
                                        });
                                      }}
                                    >
                                      Not Concur
                                    </Button>
                                  </InputAdornment>
                                ) : (
                                  ""
                                )
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
                                disabled={item.status}
                                type="text"
                                value={
                                  item.status ? item.comments : item.actual
                                }
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    rating: formData.rating.map((i) => {
                                      if (
                                        i.type === item.type &&
                                        e.target.value.length <= 150
                                      ) {
                                        i.actual = e.target.value;
                                      }
                                      return i;
                                    }),
                                  });
                                }}
                                multiline
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Button
                                      color="secondary"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          rating: formData.rating.map((i) => {
                                            if (i.type === item.type) {
                                              i.status = null;
                                              i.actual = "";
                                            }
                                            return i;
                                          }),
                                        });
                                      }}
                                    >
                                      RESET
                                    </Button>
                                  </InputAdornment>
                                }
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
                    type="text"
                    value={formData.rating.reduce((a, i) => a + i.rating, 0)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">
                    Agency/Organisation
                  </InputLabel>
                  <Input
                    disabled={disabled}
                    type="text"
                    value={formData.agency_org}
                    onChange={(e) =>
                      setFormData({ ...formData, agency_org: e.target.value })
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} container>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="source-summary">
                      Evaluator Name
                    </InputLabel>
                    <Input
                      disabled={disabled}
                      type="text"
                      value={formData.eval_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eval_name: e.target.value,
                        })
                      }
                      multiline
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="source-summary">
                      Evaluator Phone No.
                    </InputLabel>
                    <Input
                      disabled={disabled}
                      type="number"
                      value={formData.eval_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eval_phone: e.target.value,
                        })
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
                        disabled={disabled}
                        id="date-picker-dialog"
                        label="Evalutaion Date"
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
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="source-summary">Signature</InputLabel>
                  <SignatureCanvas
                    penColor="black"
                    ref={(ref) => {
                      sigCanvas = ref;
                      if (sigCanvas) {
                        // sigCanvas.clear()
                        sigCanvas.fromDataURL(signature);
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
          <Button
            disabled={
              !(
                formData.sc_value_status !== null &&
                !formData.rating.find((i) => i.status === null)
              )
            }
            onClick={handleSave}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (store) => ({
  store_data: store.sce,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      update_evaluation,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SubContractorForm);
