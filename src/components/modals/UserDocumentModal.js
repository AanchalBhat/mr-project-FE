// React Imports

import React, { useState, useEffect, Fragment } from 'react';

// Material Imports

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
  CircularProgress,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

import MuiDialog from '@material-ui/core/Dialog';

import MuiGrid from '@material-ui/core/Grid';

import CustomTable from '../../components/table';

import Autocomplete from '@material-ui/lab/Autocomplete';

// Custom Imports
import {
  acquisitionTypes,
  companyScales,
  companyTypes,
  involvements,
  techSources,
} from '../../utils/constant';

import CustomDropdown from '../../components/dropdown';

import NumberFormatCustom from '../inputs/NumberMask';

import { Axios } from './../../utils/axios';

import { uuid } from 'uuidv4';

import {
  checkAlphabetsWithDotAndSpace,
  checkNumberOnly,
} from '../../utils/regex';

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: '#f7f7f7',
    border: '3px solid #3f51b5',
    borderRadius: '20px',
    boxShadow: '0 0 3px 3px #EEEEEE',
    width: '90%',
    height: '80%',
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
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  dialogPlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const UserDocumentsModal = ({
  user,
  open,
  modalAction,
  formData,
  setFormData,
  agencyList,
  save,
  loading,
  handleExportToPdf,
  pdfLoading,
  setPdfLoading,
}) => {
  const classes = useStyles();

  // Local State

  const [debounce, setDebounce] = useState(null);

  const [titleList, setTitleList] = useState([]);

  const [codeList, setCodeList] = useState([]);

  const [titleLock, setTitleLock] = useState(false);

  const [codeLock, setCodeLock] = useState(false);

  const [error, setError] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [userList, setUserList] = useState([]);

  const [involmentTable, setInvolmentTable] = useState(null);

  const [sourceList, setSourceList] = useState([]);

  // Price Matrix

  const priceMatrixColumns = [
    {
      title: 'Description',
      field: 'description',
    },
    {
      title: 'Government Costs',
      field: 'governmentCosts',
      editComponent: (props) => {
        return (
          <FormControl>
            <Input {...props} inputComponent={NumberFormatCustom} />
          </FormControl>
        );
      },
      render: (props) => {
        return (
          <FormControl>
            <Input
              disabled={true}
              style={{ color: 'black' }}
              value={parseFloat(props.governmentCosts).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: 'Historical Price',
      field: 'historicalPrice',
      editComponent: (props) => {
        return (
          <FormControl>
            <Input {...props} inputComponent={NumberFormatCustom} />
          </FormControl>
        );
      },
      render: (props) => {
        return (
          <FormControl>
            <Input
              disabled={true}
              style={{ color: 'black' }}
              value={parseFloat(props.historicalPrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: 'Catalog Price',
      field: 'catalogPrice',
      editComponent: (props) => {
        return (
          <FormControl>
            <Input {...props} inputComponent={NumberFormatCustom} />
          </FormControl>
        );
      },
      render: (props) => {
        return (
          <FormControl>
            <Input
              disabled={true}
              style={{ color: 'black' }}
              value={parseFloat(props.catalogPrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: 'Average Price',
      field: 'averagePrice',
      editable: 'never',
      render: (props) => {
        return (
          <FormControl>
            <Input
              disabled={true}
              style={{ color: 'black' }}
              value={props && parseFloat(props.averagePrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: 'Plus 15% of AVG',
      field: 'plusAvg',
      editable: 'never',
      render: (props) => {
        return (
          <FormControl>
            <Input
              disabled={true}
              style={{ color: 'black' }}
              value={props && parseFloat(props.plusAvg).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
  ];

  // Local Variables

  const compileDataColumns = [
    {
      title: 'Market research techniques and source',
      field: 'TECHNIQUES_AND_SOURCE',
      render: (props) => (
        <span>
          {
            techSources.find((ts) => ts.value === props.TECHNIQUES_AND_SOURCE)
              .label
          }
        </span>
      ),
    },
    { title: 'Available sources', field: 'VENDOR_INFORMATION' },
    { title: 'Vendor dun', field: 'VEN_DUN' },
    {
      title: 'Vendor social economic',
      field: 'VEND_SOCIAL_ECONOMIC',
      render: (props) => (
        <span>
          {
            companyScales.find((cs) => cs.value === props.VEND_SOCIAL_ECONOMIC)
              .label
          }
        </span>
      ),
    },
    {
      title: 'Estimated Price or Value',
      field: 'price_value',
      render: (props) => <span>${props.price_value}</span>,
    },
    {
      title: 'Market price issue',
      field: 'MKT_PRICE_ISSUE',
      render: (props) => <span>${props.MKT_PRICE_ISSUE}</span>,
    },
  ];

  if (formData.documentId) {
    compileDataColumns.unshift({
      title: 'Document Id',
      render: () => <span>{formData.documentId}</span>,
    });
  }

  let dropDowns = ['acquisition', 'techSource', 'companyScale'];

  let dontCheck = [
    'provider',
    'authority',
    'involvement',
    'companyType',
    'isSubmitted',
    'officeSymbol',
    '_id',
    '__v',
    'tableData',
    'createdAt',
    'documentId',
    'organization',
    'compileDataTable',
    'involvementTableData',
    'priceMatrix',
    'compileData',
  ];

  if (formData.companyType === 'Yes') {
    dontCheck.push('addSource');
  }

  const [priceMatrixTable, setPriceMatrixTable] = useState(null);

  // useEffect(() => {
  //   alert(formData.NAICSCode);
  // }, [formData.NAICSCode]);

  const onRowAdd = (newData) =>
    new Promise((resolve, reject) => {
      const sum =
        parseFloat(newData['governmentCosts']) +
        parseFloat(newData['historicalPrice']) +
        parseFloat(newData['catalogPrice']);
      newData['averagePrice'] = parseFloat((sum / 3).toFixed(2));
      newData['plusAvg'] = (1.15 * parseFloat(newData['averagePrice'])).toFixed(
        2,
      );
      newData['index'] = uuid();
      setTimeout(() => {
        setFormData({
          ...formData,
          priceMatrix: [...formData.priceMatrix, newData],
        });
        priceMatrixTable &&
          priceMatrixTable.onChangeRowsPerPage({
            target: {
              value: formData.priceMatrix.length + 1,
            },
          });
        resolve();
      }, 500);
    });

  const onRowDelete = (oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setFormData({
          ...formData,
          priceMatrix: formData.priceMatrix.filter(
            (pm) => pm.index !== oldData.index,
          ),
        });
        resolve();
      }, 1000);
    });

  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        setFormData({
          ...formData,
          priceMatrix: formData.priceMatrix.map((pm) => {
            console.log(pm.index, newData, oldData);
            if (pm.index === newData.index) {
              pm.description = newData.description;
              pm.historicalPrice = parseFloat(newData.historicalPrice).toFixed(
                2,
              );
              pm.governmentCosts = parseFloat(newData.governmentCosts).toFixed(
                2,
              );
              pm.catalogPrice = parseFloat(newData.catalogPrice).toFixed(2);
              pm.averagePrice = (
                (parseFloat(pm.historicalPrice) +
                  parseFloat(pm.governmentCosts) +
                  parseFloat(pm.catalogPrice)) /
                3
              ).toFixed(2);
              pm.plusAvg = (1.15 * parseFloat(pm.averagePrice)).toFixed(2);
            }
            return pm;
          }),
        });
        resolve();
      }, 1000);
    });

  const filledField = Object.entries(formData).filter(([key, value]) => {
    if (key === 'sources') {
      return value.length > 0;
    }
    if (dropDowns.indexOf(key) !== -1) {
      return value !== null && value !== '';
    } else if (dontCheck.indexOf(key) === -1) {
      return value !== '';
    } else {
      return false;
    }
  }).length;

  const totalField = Object.entries(formData).filter(([key, value]) => {
    return dontCheck.indexOf(key) === -1;
  }).length;

  // useEffect

  useEffect(() => {
    setSubmitted(false);
    setError(false);
  }, [open]);

  useEffect(() => {
    if (formData.isSubmitted && submitted) {
      save();
    }
  }, [submitted]);

  useEffect(() => {
    console.info(formData.involvement);
    if (
      formData.involvement &&
      formData.involvement !== 'Please Select One User'
    ) {
      Axios.get('document/get-users', {
        params: { agency_code: user.agency_code, role: formData.involvement },
      })
        .then((response) => {
          if (response.data.status) {
            if (response.data.users.length > 0) {
              setUserList(response.data.users);
            } else {
              alert(
                'Your agency has no users of the role. Please select another role.',
              );
            }
          } else {
            alert('Something went wrong! Please try again');
          }
        })
        .catch((err) => {
          alert('Something went wrong! Please try again.');
          console.error(err);
        });
    }
  }, [formData.involvement]);

  // Local Methods

  const handleSubmit = () => {
    if (filledField === totalField) {
      setFormData({
        ...formData,
        isSubmitted: true,
      });
      setSubmitted(true);
    } else {
      alert('All fields are required! Please check before again.');
      setError(true);
    }
  };

  // Auto Complete Props

  const titleProps = {
    options: titleList,
    disabled: formData.isSubmitted || titleLock,
    getOptionLabel: (option) => option._id.description,
    freeSolo: false,
    onChange: (event, newValue) => {
      if (!newValue) {
        setTitleList([]);
        setCodeLock(false);
        setFormData({ ...formData, NAICSCode: '' });
      } else {
        setFormData({
          ...formData,
          title: newValue._id.description,
          NAICSCode: newValue._id.code,
        });
        setCodeLock(true);
      }
    },
    onKeyPress: (e) => {
      if (!checkAlphabetsWithDotAndSpace(e.key)) {
        e.preventDefault();
      }
    },
    autoHighlight: true,
    autoSelect: true,
    clearOnBlur: true,
    inputValue: formData.title,
    onInputChange: (event, newInputValue) => {
      if (debounce) clearTimeout(debounce);
      setDebounce(
        setTimeout(() => {
          if (newInputValue.length >= 5) {
            Axios.get('document/naics-details', {
              params: { description: newInputValue },
            })
              .then((response) => {
                if (response.data.status) setTitleList(response.data.data);
              })
              .catch((err) => {
                console.log(err);
                alert('Something went wrong! Please try again.');
              });
          }
        }, 800),
      );
      if (event && newInputValue.length === 0) {
        console.log(event, newInputValue);
        setTitleList([]);
        setCodeLock(false);
        setFormData({ ...formData, NAICSCode: '' });
        setFormData({ ...formData, title: newInputValue });
      } else if (event) {
        setFormData({ ...formData, title: newInputValue });
      }
    },
    renderInput: (params) => (
      <TextField
        {...params}
        required
        error={error && formData.title === ''}
        type="text"
        label="Title"
        margin="none"
      />
    ),
  };

  const updateSelectedSource = (key, value, name = null) => {
    setFormData({
      ...formData,
      [name]: value,
      compileDataTable: formData.compileDataTable.map((d) => ({
        ...d,
        [key]: value,
      })),
    });
  };

  const sourcesProps = {
    options: sourceList,
    disabled: formData.isSubmitted,
    getOptionLabel: (option) => option.LEGAL_BUSINESS_NAME,
    freeSolo: false,
    onChange: (event, newValue) => {
      setSourceList([]);
      setFormData({
        ...formData,
        sources: newValue.map((d) => ({
          LEGAL_BUSINESS_NAME: d.LEGAL_BUSINESS_NAME,
          DUNS: d.DUNS,
        })),
        compileDataTable: newValue.map((d) => ({
          TECHNIQUES_AND_SOURCE: formData.techSource,
          VENDOR_INFORMATION: d.LEGAL_BUSINESS_NAME,
          VEN_DUN: d.DUNS,
          VEND_SOCIAL_ECONOMIC: formData.companyScale,
          MKT_PRICE_ISSUE: formData.issues_amt,
          price_value: formData.price_value,
        })),
      });
    },
    onKeyPress: (e) => {
      if (
        !checkAlphabetsWithDotAndSpace(e.key) ||
        formData.compileDataTable.length === 3
      ) {
        e.preventDefault();
      }
    },
    autoHighlight: true,
    autoSelect: true,
    clearOnBlur: false,
    multiple: true,
    // defaultValue: formData.sources,
    value: formData.sources,
    onInputChange: (event, newInputValue) => {
      if (
        newInputValue.length > 3 &&
        newInputValue.trimEnd().length === newInputValue.length - 2
      ) {
        setFormData({
          ...formData,
          sources: [
            ...formData.sources,
            {
              LEGAL_BUSINESS_NAME: newInputValue.trimEnd(),
              DUNS: '',
            },
          ],
          compileDataTable: [
            ...formData.compileDataTable,
            {
              TECHNIQUES_AND_SOURCE: formData.techSource,
              VENDOR_INFORMATION: newInputValue.trimEnd(),
              VEN_DUN: '',
              VEND_SOCIAL_ECONOMIC: formData.companyScale,
              MKT_PRICE_ISSUE: formData.issues_amt,
              price_value: formData.price_value,
            },
          ],
        });
      } else {
        if (debounce) clearTimeout(debounce);
        setDebounce(
          setTimeout(() => {
            if (newInputValue.length >= 5) {
              Axios.get('document/get-vendors', {
                params: { LEGAL_BUSINESS_NAME: newInputValue },
              })
                .then((response) => {
                  if (response.data.status) {
                    setSourceList(response.data.result);
                  }
                })
                .catch((err) => {
                  alert('Something went wrong. Please try again');
                  console.error(err);
                });
            }
          }, 1000),
        );
      }
    },
    renderInput: (params) => (
      <TextField
        {...params}
        required
        error={error && formData.sources.length === 0}
        type="text"
        label="Available Sources"
        margin="none"
      />
    ),
  };

  const codeProps = {
    options: codeList,
    disabled: formData.isSubmitted || codeLock,
    getOptionLabel: (option) => option._id.code,
    freeSolo: false,
    onChange: (event, newValue) => {
      if (!newValue) {
        setTitleList([]);
        setTitleLock(false);
        setFormData({ ...formData, title: '' });
      } else {
        setFormData({
          ...formData,
          title: newValue._id.description,
          NAICSCode: newValue._id.code,
        });
        setTitleLock(true);
      }
    },
    onKeyPress: (e) => {
      if (!checkNumberOnly(e.key)) {
        e.preventDefault();
      }
    },
    autoHighlight: true,
    autoSelect: true,
    clearOnBlur: true,
    inputValue: formData.NAICSCode,
    onInputChange: (event, newInputValue) => {
      if (debounce) clearTimeout(debounce);
      setDebounce(
        setTimeout(() => {
          if (newInputValue.length > 3) {
            Axios.get('document/naics-details', {
              params: { code: newInputValue },
            })
              .then((response) => {
                if (response.data.status) setCodeList(response.data.data);
              })
              .catch((err) => {
                console.log(err);
                alert('Something went wrong! Please try again.');
              });
          }
        }, 800),
      );
      if (event && newInputValue.length === 0) {
        setCodeList([]);
        setTitleLock(false);
        setFormData({ ...formData, title: '' });
        setFormData({ ...formData, NAICSCode: newInputValue });
      } else if (event) {
        setFormData({ ...formData, NAICSCode: newInputValue });
      }
    },
    renderInput: (params) => (
      <TextField
        {...params}
        required
        error={error && formData.NAICSCode === ''}
        type="text"
        label="NAICS Code"
        margin="none"
      />
    ),
  };

  const handleBlur = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      {!loading ? (
        <Fragment>
          <DialogTitle>
            <Typography className={classes.licenseTitle}>
              {formData.documentId || 'New Document'}
            </Typography>
          </DialogTitle>
          <DialogContent className={classes.content}>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={6}>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="provider">Prepared by</InputLabel>
                  <Input
                    type="text"
                    value={formData.provider}
                    disabled={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="authority">Authority</InputLabel>
                  <Input
                    id="authority"
                    type="text"
                    value={formData.authority}
                    disabled={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="office_symbol">Office symbol</InputLabel>
                  <Input
                    id="office_symbol"
                    type="text"
                    value={formData.officeSymbol}
                    disabled={true}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label={'Organizations'}
                  value={formData.organization}
                  options={agencyList}
                  required
                  isDisabled={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  required
                  error={error && formData.title === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <Autocomplete {...titleProps} />
                  <FormHelperText id="NaicsTitle">
                    Choose one from the list. Have to type atleast 5 characters
                    for the Autocomplete to populate.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  required
                  error={error && formData.NAICSCode === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <Autocomplete {...codeProps} />
                  <FormHelperText id="NaicsCode">
                    Choose one from the list. Have to type atleast 3 characters
                    for the Autocomplete to populate.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label="Type of acquisition"
                  value={formData.acquisition}
                  options={acquisitionTypes}
                  required
                  error={error && formData.acquisition === null}
                  isDisabled={formData.isSubmitted}
                  handleChange={(e) =>
                    setFormData({ ...formData, acquisition: e })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              justifycontent="center"
              alignItems="center"
              spacing={3}
              className={classes.fullWidth}
            >
              <Grid item xs={8} md={8}>
                <FormControl
                  required
                  error={error && formData.requirements === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="users-requirements">
                    Initial users requirements
                  </InputLabel>
                  <Input
                    id="users-requirements"
                    type="text"
                    multiline
                    defaultValue={formData.requirements}
                    name="requirements"
                    onBlur={handleBlur}
                    onKeyPress={(e) =>
                      e.target.value.length >= 3500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({ ...formData, requirements: e.target.value })
                    // }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4}>
                <FormControl
                  required
                  error={error && formData.price_value === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="price_value">
                    Estimated Price or Value
                  </InputLabel>
                  <Input
                    defaultValue={formData.price_value}
                    name="price_value"
                    onBlur={(e) => {
                      updateSelectedSource(
                        'price_value',
                        e.target.value.replace(/[^\d.]/g, ''),
                        'price_value',
                      );
                    }}
                    inputComponent={NumberFormatCustom}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label="Functional involvement"
                  value={formData.involvement}
                  options={involvements}
                  isDisabled={formData.isSubmitted}
                  handleChange={(e) => {
                    setUserList([]);
                    setFormData({ ...formData, involvement: e });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label="Users"
                  options={[
                    { label: 'Please select one', value: null },
                    ...userList.map((user) => ({
                      ...user,
                      label: user.userId,
                      value: user.userId,
                    })),
                  ]}
                  isDisabled={formData.isSubmitted}
                  handleChange={(e) => {
                    if (
                      formData.involvementTableData.find((u) => u.userId === e)
                    ) {
                      alert('User has been added already.');
                    } else {
                      const funcUser = userList.find((u) => u.userId === e);
                      if (funcUser) {
                        setFormData({
                          ...formData,
                          involvementTableData: [
                            ...formData.involvementTableData,
                            userList.find((u) => u.userId === e),
                          ],
                        });
                        involmentTable &&
                          involmentTable.onChangeRowsPerPage({
                            target: {
                              value: formData.involvementTableData.length + 1,
                            },
                          });
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <CustomTable
                  title="Involvement of team members"
                  columns={[
                    { title: 'id', field: 'userId' },
                    { title: 'Office symbol', field: 'office_symbol' },
                    { title: 'Phone', field: 'phone' },
                  ]}
                  pageSize={formData.involvementTableData.length}
                  data={formData.involvementTableData}
                  onRowDelete={
                    formData.isSubmitted
                      ? null
                      : (oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              setFormData({
                                ...formData,
                                involvementTableData: formData.involvementTableData.filter(
                                  (data) => data.userId !== oldData.userId,
                                ),
                              });
                              involmentTable &&
                                involmentTable.onChangeRowsPerPage({
                                  target: {
                                    value:
                                      formData.involvementTableData.length - 1,
                                  },
                                });
                              resolve();
                            }, 800);
                          })
                  }
                  tableRef={(ref) => setInvolmentTable(ref)}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label="Market research techniques and source"
                  options={techSources}
                  value={formData.techSource}
                  required
                  isDisabled={formData.isSubmitted}
                  error={error && formData.techSource === null}
                  handleChange={(e) => {
                    updateSelectedSource(
                      'TECHNIQUES_AND_SOURCE',
                      e,
                      'techSource',
                    );
                  }}
                  handleBlur={(e) => {
                    updateSelectedSource(
                      'TECHNIQUES_AND_SOURCE',
                      e,
                      'techSource',
                    );
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.sources.length === 0}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <Autocomplete {...sourcesProps} />
                  <FormHelperText>
                    To add a source not in SAMS, enter the name with two
                    trailing spaces
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label="Business classification"
                  options={companyScales}
                  value={formData.companyScale}
                  required
                  isDisabled={formData.isSubmitted}
                  error={error && formData.companyScale === null}
                  handleChange={(e) => {
                    updateSelectedSource(
                      'VEND_SOCIAL_ECONOMIC',
                      e,
                      'companyScale',
                    );
                  }}
                  handleBlur={(e) => {
                    updateSelectedSource(
                      'VEND_SOCIAL_ECONOMIC',
                      e,
                      'companyScale',
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDropdown
                  label={'Sole source'}
                  value={formData.companyType}
                  options={companyTypes}
                  isDisabled={formData.isSubmitted}
                  handleChange={(e) =>
                    setFormData({ ...formData, companyType: e })
                  }
                  handleBlur={(e) =>
                    setFormData({ ...formData, companyType: e })
                  }
                />
              </Grid>
              {formData.companyType === 'No' ? (
                <Fragment>
                  <Grid item xs={12} md={12}>
                    <FormControl
                      required
                      error={error && formData.addSource === ''}
                      className={classes.formControl}
                      disabled={formData.isSubmitted}
                    >
                      <InputLabel htmlFor="add-sources">
                        Additional sources
                      </InputLabel>
                      <Input
                        id="add-sources"
                        type="text"
                        multiline
                        defaultValue={formData.addSource}
                        name="addSource"
                        onKeyPress={(e) =>
                          e.target.value.length >= 700 && e.preventDefault()
                        }
                        onBlur={handleBlur}
                        // value={formData.addSource}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     addSource: e.target.value,
                        //   })
                        // }
                      />
                      <FormHelperText id="add-sources">
                        Describe Effort to locate additional sources
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Fragment>
              ) : null}
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.sourceSummary === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="source-summary">
                    Source Summary{' '}
                  </InputLabel>
                  <Input
                    id="source-summary"
                    type="text"
                    multiline
                    // value={formData.sourceSummary}
                    name="sourceSummary"
                    onBlur={handleBlur}
                    onKeyPress={(e) =>
                      e.target.value.length >= 1500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     sourceSummary: e.target.value,
                    //   })
                    // }
                    defaultValue={formData.sourceSummary}
                  />
                  <FormHelperText id="source-summary">
                    Summarize product/service characteristic and capabilities
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.characteristic === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="product-service">
                    Product/Service characteristics
                  </InputLabel>
                  <Input
                    id="product-service"
                    type="text"
                    multiline
                    defaultValue={formData.characteristic}
                    name="characteristic"
                    onBlur={handleBlur}
                    // value={formData.characteristic}
                    onKeyPress={(e) =>
                      e.target.value.length >= 1500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     characteristic: e.target.value,
                    //   })
                    // }
                  />
                  <FormHelperText id="product-service">
                    Summarize product/service characteristic and capabilities
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.extentMarket === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="extent-market">
                    Extent of commerciality in the market
                  </InputLabel>
                  <Input
                    id="extent-market"
                    type="text"
                    multiline
                    defaultValue={formData.extentMarket}
                    name="extentMarket"
                    onBlur={handleBlur}
                    // value={formData.extentMarket}
                    onKeyPress={(e) =>
                      e.target.value.length >= 1500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({ ...formData, extentMarket: e.target.value })
                    // }
                  />
                  <FormHelperText id="extent-market">
                    Describe market place: Access to Government’s leverage in
                    market (Foreign/State/Local) commercial items
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.businessPractices === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="business-partices">
                    Prevalent business practices
                  </InputLabel>
                  <Input
                    id="business-partices"
                    type="text"
                    multiline
                    defaultValue={formData.businessPractices}
                    name="businessPractices"
                    onBlur={handleBlur}
                    // value={formData.businessPractices}
                    onKeyPress={(e) =>
                      e.target.value.length >= 2500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     businessPractices: e.target.value,
                    //   })
                    // }
                  />
                  <FormHelperText id="extent-market">
                    Describe marketplace: Standard/customary terms/conditions
                    and business provision for industry
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={8} md={8}>
                <FormControl
                  required
                  error={error && formData.issues === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="issues">
                    Market and pricing issues
                  </InputLabel>
                  <Input
                    id="issues"
                    type="text"
                    multiline
                    defaultValue={formData.issues}
                    name="issues"
                    onBlur={handleBlur}
                    // value={formData.issues}
                    onKeyPress={(e) =>
                      e.target.value.length >= 1500 && e.preventDefault()
                    }
                    // onChange={(e) =>
                    //   setFormData({ ...formData, issues: e.target.value })
                    // }
                  />
                  <FormHelperText id="issues">
                    Identify pricing issues, price range, and price variations,
                    identify trends, -technical/pricing/business/etc
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4}>
                <FormControl
                  required
                  error={error && formData.issues_amt === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="issues">
                    Market and pricing issue Amount
                  </InputLabel>
                  <Input
                    defaultValue={formData.issues_amt}
                    // value={formData.issues_amt}
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     issues_amt: e,
                    //   })
                    // }
                    name="issues_amt"
                    onBlur={(e) => {
                      updateSelectedSource(
                        'MKT_PRICE_ISSUE',
                        e.target.value.replace(/[^\d.]/g, ''),
                        'issues_amt',
                      );
                    }}
                    inputComponent={NumberFormatCustom}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <FormControl
                  required
                  error={error && formData.consideration === ''}
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="others">Other consideration</InputLabel>
                  <Input
                    id="others"
                    type="text"
                    multiline
                    defaultValue={formData.consideration}
                    name="consideration"
                    onBlur={handleBlur}
                    onKeyPress={(e) =>
                      e.target.value.length >= 1500 && e.preventDefault()
                    }
                    // value={formData.consideration}
                    // onChange={(e) =>
                    //   setFormData({
                    //     ...formData,
                    //     consideration: e.target.value,
                    //   })
                    // }
                  />
                  <FormHelperText id="others">
                    Identify other consideration gather from market research
                    analysis
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.fullWidth}>
              <Grid item xs={12} md={12}>
                <FormControl
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <InputLabel htmlFor="compile-data">
                    Market Research Analysis
                  </InputLabel>
                  <Input
                    id="compile-data"
                    type="text"
                    multiline
                    defaultValue={formData.compileData}
                    onKeyPress={(e) =>
                      e.target.value >= 1500 && e.preventDefault()
                    }
                    // value={formData.compileData}
                    name="compileData"
                    onBlur={handleBlur}
                  />
                  <FormHelperText id="compile-data">
                    Analyze data gather during market research, provide
                    conclusion and recommendations. Document the decision to
                    satisfy the organizational needs
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                {/* <FormControl className={classes.formControl}> */}
                <CustomTable
                  title="Compile Data"
                  columns={compileDataColumns}
                  pageSize={3}
                  data={formData.compileDataTable}
                />
                {/* </FormControl> */}
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl
                  className={classes.formControl}
                  disabled={formData.isSubmitted}
                >
                  <CustomTable
                    title="Cost and price analyst work sheet"
                    columns={priceMatrixColumns}
                    tableRef={(ref) => setPriceMatrixTable(ref)}
                    pageSize={formData.priceMatrix.length || 1}
                    data={formData.priceMatrix}
                    OnRowAdd={formData.isSubmitted ? null : onRowAdd}
                    onRowDelete={formData.isSubmitted ? null : onRowDelete}
                    OnRowUpdate={formData.isSubmitted ? null : onRowUpdate}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <span style={{ position: 'absolute', left: 50 }}>
              {' '}
              {filledField} / {totalField} Fields Filled{' '}
            </span>
            <Button
              className={classes.button}
              onClick={() => modalAction(false)}
              color="secondary"
            >
              {formData.isSubmitted ? 'Close' : 'Cancel'}
            </Button>
            {formData.isSubmitted ? (
              <Fragment>
                {pdfLoading ? (
                  <Button
                    className={classes.button}
                    onClick={handleExportToPdf}
                    color="primary"
                  >
                    <CircularProgress size={20} />
                  </Button>
                ) : (
                  <Button
                    className={classes.button}
                    onClick={handleExportToPdf}
                    color="primary"
                  >
                    Export To PDF
                  </Button>
                )}
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  className={classes.button}
                  onClick={save}
                  color="primary"
                >
                  Save
                </Button>
                <Button
                  className={classes.button}
                  onClick={handleSubmit}
                  color="primary"
                >
                  Submit
                </Button>
              </Fragment>
            )}
          </DialogActions>
        </Fragment>
      ) : (
        <DialogContent className={classes.dialogPlaceholder}>
          <CircularProgress color="inherit" />
          <br />
          <Typography variant="h6">
            Loading Your Document. Please Wait!
          </Typography>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UserDocumentsModal;
