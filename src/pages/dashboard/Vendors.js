import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  DialogActions,
  Button,
  TextField,
  withStyles,
  ButtonGroup,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import MuiGrid from '@material-ui/core/Grid';
import CustomTable from '../../components/table';
import { Axios } from '../../utils/axios';
import {
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  Typography,
  Backdrop,
} from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';

const Dialog = withStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 3, 1, 3),
    background: '#f7f7f7',
    border: '3px solid #3f51b5',
    borderRadius: '20px',
    boxShadow: '0 0 3px 3px #EEEEEE',
    width: '70%',
    height: '90%',
    maxWidth: 1000,
  },
}))(MuiDialog);
const createData = (VEND_DUN, VEND_NAME, VEND_ADDRESS1) => ({
  VEND_DUN,
  VEND_NAME,
  VEND_ADDRESS1,
});

const useStyles = makeStyles((theme) => ({
  cardVendor: {
    width: '27rem',
    margin: '1rem',
    padding: '3rem',
    position: 'relative',
    display: 'flex',
    border: '1px solid #c4c4c4',
    borderRadius: '5px',
  },
  firstTag: {
    marginRight: '1rem',
    color: '#8b8b8b',
  },
  firstPara: {
    color: '#8b8b8b',
    fontWeight: '600',
  },
  inputField: {
    border: '1px solid #c4c4c4',
    padding: '18px',
    borderRadius: '4px',
    color: '#8b8b8b',
  },
  vendorDiv: {
    width: '55%',
    marginLeft: '14px',
  },
  vendorTag: {
    marginTop: '22px',
  },
  customData: {
    width: '100%',
    border: '1px solid #c4c4c4',
    borderRadius: '5px',
    marginTop: '1rem',
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  button: {
    fontSize: '18px',
    fontWeight: 600,
  },
  formControl: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  removeBorder: {
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderTopColor: '#d8d8d838',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  dialogPlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));
const Grid = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
  },
}))(MuiGrid);

const Vendors = (props) => {
  const classes = useStyles();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [switchTab, setSwitchTab] = useState('');
  const [naicsCode, setNaicsCode] = useState('');
  const [valueOne, setValueOne] = useState('');
  const [auto, setAuto] = useState('');
  const [options, setOptions] = useState([]);
  const [naicsDescriptionKey, setnaicsDescriptionKey] = useState('');
  const [naicsDescriptionOptions, setNaicsDescriptionOptions] = useState([]);
  const [loading, setloading] = useState(false);
  const [naicsloading, setNaicsloading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [tableRef, setTableRef] = useState(null);
  //map data to model
  const [DUNS, setDUNS] = useState('');
  const [DUNS_PLUS_4, setDUNS_PLUS_4] = useState('');
  const [CAGE_CODE, setCAGE_CODE] = useState('');
  const [ACTIVATION_DATE, setACTIVATION_DATE] = useState('');
  const [LEGAL_BUSINESS_NAME, setLEGAL_BUSINESS_NAME] = useState('');
  const [DBA_NAME, setDBA_NAME] = useState('');
  const [PHYSICAL_ADDRESS_LINE_1, setPHYSICAL_ADDRESS_LINE_1] = useState('');
  const [PHYSICAL_ADDRESS_LINE_2, setPHYSICAL_ADDRESS_LINE_2] = useState('');
  const [PHYSICAL_ADDRESS_CITY, setPHYSICAL_ADDRESS_CITY] = useState('');
  const [
    PHYSICAL_ADDRESS_PROVINCE_OR_STATE,
    setPHYSICAL_ADDRESS_PROVINCE_OR_STATE,
  ] = useState('');
  const [
    PHYSICAL_ADDRESS_ZIP_POSTAL_CODE,
    setPHYSICAL_ADDRESS_ZIP_POSTAL_CODE,
  ] = useState('');
  const [
    PHYSICAL_ADDRESS_ZIP_CODE_v4,
    setPHYSICAL_ADDRESS_ZIP_CODE_v4,
  ] = useState('');
  const [
    PHYSICAL_ADDRESS_COUNTRY_CODE,
    setPHYSICAL_ADDRESS_COUNTRY_CODE,
  ] = useState('');
  const [PRIMARY_NAICS, setPRIMARY_NAICS] = useState('');
  const [NAICS_CODE_STRING, setNAICS_CODE_STRING] = useState('');
  const [GOVT_BUS_POC_FIRST_NAME, setGOVT_BUS_POC_FIRST_NAME] = useState('');
  const [
    GOVT_BUS_POC_MIDDLE_INITIAL,
    setGOVT_BUS_POC_MIDDLE_INITIAL,
  ] = useState('');
  const [GOVT_BUS_POC_LAST_NAME, setGOVT_BUS_POC_LAST_NAME] = useState('');
  const [GOVT_BUS_POC_TITLE, setGOVT_BUS_POC_TITLE] = useState('');
  const [GOVT_BUS_POC_US_PHONE, setGOVT_BUS_POC_US_PHONE] = useState('');
  const [GOVT_BUS_POC_US_PHONE_EXT, setGOVT_BUS_POC_US_PHONE_EXT] = useState(
    '',
  );
  const [GOVT_BUS_POC_NON_US_PHONE, setGOVT_BUS_POC_NON_US_PHONE] = useState(
    '',
  );
  const [GOVT_BUS_POC_FAX_US_ONLY, setGOVT_BUS_POC_FAX_US_ONLY] = useState('');
  const [GOVT_BUS_POC_EMAIL, setGOVT_BUS_POC_EMAIL] = useState('');

  const [openUserEditModal, setUserEditModal] = useState(false);
  const hasNumber = /\d/;

  const columns = [
    { title: 'Duns', field: 'DUNS' },
    { title: 'NAICS Code', field: 'PRIMARY_NAICS' },
    { title: 'Vendor Name', field: 'LEGAL_BUSINESS_NAME' },
    { title: 'Address 1', field: 'PHYSICAL_ADDRESS_LINE_1' },
    {
      title: 'Action',
      field: 'action',
      render: (rowData) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onClickview(rowData)}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  const [vendorss, setVendors] = useState([]);
  const [resData, setResData] = useState([]);
  const onClickview = (data) => {
    setUserEditModal(true);
    setDetailLoading(true);
    Axios.get('/vendor/getNAICSDescriptionString', {
      params: { key: data['PRIMARY_NAICS'] },
    })
      .then((res) => {
        let d = res.data.data;
        setDUNS(data['DUNS']);
        setDUNS_PLUS_4(data['DUNS_PLUS_4']);
        setCAGE_CODE(data['CAGE_CODE']);
        setACTIVATION_DATE(data['ACTIVATION_DATE']);
        setLEGAL_BUSINESS_NAME(data['LEGAL_BUSINESS_NAME']);
        setDBA_NAME(data['DBA_NAME']);
        setPHYSICAL_ADDRESS_LINE_1(data['PHYSICAL_ADDRESS_LINE_1']);
        setPHYSICAL_ADDRESS_LINE_2(data['PHYSICAL_ADDRESS_LINE_2']);
        setPHYSICAL_ADDRESS_CITY(data['PHYSICAL_ADDRESS_CITY']);
        setPHYSICAL_ADDRESS_PROVINCE_OR_STATE(
          data['PHYSICAL_ADDRESS_PROVINCE_OR_STATE'],
        );
        setPHYSICAL_ADDRESS_ZIP_POSTAL_CODE(
          data['PHYSICAL_ADDRESS_ZIP_POSTAL_CODE'],
        );
        setPHYSICAL_ADDRESS_ZIP_CODE_v4(data['PHYSICAL_ADDRESS_ZIP_CODE_v4']);
        setPHYSICAL_ADDRESS_COUNTRY_CODE(data['PHYSICAL_ADDRESS_COUNTRY_CODE']);
        setPRIMARY_NAICS(data['PRIMARY_NAICS']);
        setNAICS_CODE_STRING(d['NAICS Description']);
        setGOVT_BUS_POC_FIRST_NAME(data['GOVT_BUS_POC_FIRST_NAME']);
        setGOVT_BUS_POC_MIDDLE_INITIAL(data['GOVT_BUS_POC_MIDDLE_INITIAL']);
        setGOVT_BUS_POC_LAST_NAME(data['GOVT_BUS_POC_LAST_NAME']);
        setGOVT_BUS_POC_TITLE(data['GOVT_BUS_POC_TITLE']);
        setGOVT_BUS_POC_US_PHONE(
          formatPhoneNumber(data['GOVT_BUS_POC_US_PHONE']),
        );
        setGOVT_BUS_POC_US_PHONE_EXT(data['GOVT_BUS_POC_US_PHONE_EXT']);
        setGOVT_BUS_POC_NON_US_PHONE(data['GOVT_BUS_POC_NON_US_PHONE']);
        setGOVT_BUS_POC_FAX_US_ONLY(
          formatPhoneNumber(data['GOVT_BUS_POC_FAX_US_ONLY']),
        );
        setGOVT_BUS_POC_EMAIL(data['GOVT_BUS_POC_EMAIL']);
        setDetailLoading(false);
      })
      .catch((err) => {
        setDetailLoading(false);
      });
  };
  const handleText = (event) => {
    setValueOne(event.target.value);
  };
  const handleNaicsCode = (event) => {
    setNaicsCode(event.target.value);
  };
  const handleInputChange = (event, value) => {
    setAuto(value);
    setloading(true);
    if (value.length >= 3) {
      setTimeout(() => {
        Axios.get('/vendor/getVendorName', {
          params: { key: value.toUpperCase() },
        })
          .then((res) => {
            let d = res.data.data;
            setOptions(d);
            setloading(false);
          })
          .catch((err) => {
            console.info(err);
            setloading(false);
          });
      }, 200);
    } else {
      setloading(false);
      if (value.length == 0) {
        setVendors([]);
        setOptions([]);
      }
    }
  };
  //NAICS description
  const handleNAICSDescriptionInputChange = (event, value) => {
    setnaicsDescriptionKey(value);
    setNaicsloading(true);
    if (value.length >= 3) {
      setTimeout(() => {
        Axios.get('/vendor/getNAICSDescriptions', {
          params: { key: value.toUpperCase() },
        })
          .then((res) => {
            let d = res.data.data;
            setNaicsDescriptionOptions(
              d.map((n) => {
                return { des: n['NAICS_DESCRIPTION'], code: n['NAICS_CODE'] };
              }),
            );
            setNaicsloading(false);
          })
          .catch((err) => {
            console.info(err);
            setNaicsloading(false);
          });
      }, 200);
    } else {
      setNaicsloading(false);
      if (value.length == 0) {
        setNaicsDescriptionOptions([]);
      }
    }
  };
  const handleBack = () => {
    setUserEditModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      auto === '' &&
      valueOne === '' &&
      naicsCode === '' &&
      naicsDescriptionKey === ''
    ) {
      alert('Please enter atleast one search key!');
    } else {
      if (countMutipleInputs(auto, valueOne, naicsCode) > 1) {
        alert('Only one input allowed at a time.');
      } else {
        tableRef && tableRef.onQueryChange();
        // Axios.get(`vendor/searchVendor?`, {
        //   params: {
        //     vendorName: auto,
        //     dunsNumber: valueOne,
        //     naicsCode,
        //     naicsDescriptionKey,
        //   },
        // })
        //   .then((res) => {
        //     console.log("Vendors data:", res.data.data);
        //     setData(removeDuplicates([...res.data.data],'DUNS'));
        //     setIsDataLoading(false);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     setIsDataLoading(false);
        //   });
      }
    }
  };

  // Paginated Table Methods

  const onChangeRowsPerPage = (e) => {
    setPageSize(e);
  };

  const getTableData = (query) => {
    return new Promise((resolve, reject) => {
      let url = 'vendor/searchVendor?';
      Axios.get(url, {
        params: {
          vendorName: auto,
          dunsNumber: valueOne,
          naicsCode,
          naicsDescriptionKey,
          limit: query.pageSize,
          offset: query.pageSize * query.page,
        },
      }).then((result) => {
        if (auto || valueOne) {
          setResData(
            removeDuplicates([...result.data.data, ...resData], 'DUNS'),
          );
        }
        resolve({
          data: result.data.data,
          page: result.data.page,
          totalCount: result.data.total,
        });
      });
    });
  };

  const getSelectedNAICSCode = (newVal) => {
    if (newVal) {
      setNaicsCode(newVal.code);
    } else {
      setNaicsCode('');
    }
  };
  const formatPhoneNumber = (phoneNumberString) => {
    if (phoneNumberString.length > 1) {
      let phone = phoneNumberString.split();
      if (phone[0] != '+') {
        phoneNumberString = '+1' + phoneNumberString;
      }
    }
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return '';
  };
  const removeDuplicates = (array, key) => {
    let lookup = {};
    let result = [];

    array.forEach((element) => {
      if (!lookup[element[key]]) {
        lookup[element[key]] = true;
        result.push(element);
      }
    });

    return result;
  };
  const countMutipleInputs = (auto, valueOne, naicsCode) => {
    return (auto ? 1 : 0) + (valueOne ? 1 : 0) + (naicsCode ? 1 : 0);
  };
  useState(() => {
    tableRef && tableRef.onQueryChange();
  }, [tableRef]);
  return (
    <>
      <Dialog
        open={openUserEditModal}
        aria-labelledby="form-dialog-title"
        onClose={() => setUserEditModal(false)}
      >
        {!detailLoading ? (
          <DialogContent className={classes.content}>
            <fieldset className={classes.removeBorder}>
              <legend>VENDOR INFO</legend>
              <Grid container spacing={3} className={classes.fullWidth}>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="DUNS">DUNS</InputLabel>
                    <Input id="DUNS" type="text" value={DUNS} />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="DUNS_PLUS_4">DUNS PLUS 4</InputLabel>
                    <Input id="DUNS_PLUS_4" type="text" value={DUNS_PLUS_4} />
                  </FormControl>
                </Grid>
                {CAGE_CODE && (
                  <Grid item xs={12} md={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="CAGE_CODE">CAGE CODE</InputLabel>
                      <Input id="CAGE_CODE" type="text" value={CAGE_CODE} />
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="ACTIVATION_DATE">
                      ACTIVATION DATE
                    </InputLabel>
                    <Input
                      id="ACTIVATION_DATE"
                      type="text"
                      value={ACTIVATION_DATE}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="LEGAL_BUSINESS_NAME">
                      LEGAL BUSINESS NAME
                    </InputLabel>
                    <Input
                      id="LEGAL_BUSINESS_NAME"
                      type="text"
                      value={LEGAL_BUSINESS_NAME}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="DBA_NAME">DBA NAME</InputLabel>
                    <Input id="DBA_NAME" type="text" value={DBA_NAME} />
                  </FormControl>
                </Grid>
              </Grid>
            </fieldset>
            <fieldset className={classes.removeBorder}>
              <legend>PHYSICAL ADDRESS</legend>
              <Grid container spacing={3} className={classes.fullWidth}>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_LINE_1">
                      PHYSICAL ADDRESS LINE 1
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_LINE_1"
                      type="text"
                      value={PHYSICAL_ADDRESS_LINE_1}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_LINE_2">
                      PHYSICAL ADDRESS LINE 2
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_LINE_2"
                      type="text"
                      value={PHYSICAL_ADDRESS_LINE_2}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_CITY">
                      CITY
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_CITY"
                      type="text"
                      value={PHYSICAL_ADDRESS_CITY}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_PROVINCE_OR_STATE">
                      PROVINCE OR STATE
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_PROVINCE_OR_STATE"
                      type="text"
                      value={PHYSICAL_ADDRESS_PROVINCE_OR_STATE}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_ZIP_POSTAL_CODE">
                      ZIP POSTAL CODE
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_ZIP_POSTAL_CODE"
                      type="text"
                      value={PHYSICAL_ADDRESS_ZIP_POSTAL_CODE}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} md={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="PHYSICAL_ADDRESS_ZIP_CODE_v4">ZIP_CODE_v4</InputLabel>
                  <Input id="PHYSICAL_ADDRESS_ZIP_CODE_v4" type="text"  value={PHYSICAL_ADDRESS_ZIP_CODE_v4}/>
                </FormControl>
              </Grid> */}
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PHYSICAL_ADDRESS_COUNTRY_CODE">
                      COUNTRY CODE
                    </InputLabel>
                    <Input
                      id="PHYSICAL_ADDRESS_COUNTRY_CODE"
                      type="text"
                      value={PHYSICAL_ADDRESS_COUNTRY_CODE}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </fieldset>
            <fieldset className={classes.removeBorder}>
              <legend>NAICS</legend>
              <Grid container spacing={3} className={classes.fullWidth}>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="PRIMARY_NAICS">
                      PRIMARY NAICS
                    </InputLabel>
                    <Input
                      id="PRIMARY_NAICS"
                      type="text"
                      value={PRIMARY_NAICS}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="NAICS_CODE_STRING">
                      NAICS DESCRIPTION
                    </InputLabel>
                    <Input
                      id="NAICS_CODE_STRING"
                      type="text"
                      value={NAICS_CODE_STRING}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </fieldset>
            <fieldset className={classes.removeBorder}>
              <legend>GOVT BUS POC</legend>
              <Grid container spacing={3} className={classes.fullWidth}>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_FIRST_NAME">
                      FIRST NAME
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_FIRST_NAME"
                      type="text"
                      value={GOVT_BUS_POC_FIRST_NAME}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_MIDDLE_INITIAL">
                      MIDDLE INITIAL
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_MIDDLE_INITIAL"
                      type="text"
                      value={GOVT_BUS_POC_MIDDLE_INITIAL}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_LAST_NAME">
                      LAST NAME
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_LAST_NAME"
                      type="text"
                      value={GOVT_BUS_POC_LAST_NAME}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_TITLE">TITLE</InputLabel>
                    <Input
                      id="GOVT_BUS_POC_TITLE"
                      type="text"
                      value={GOVT_BUS_POC_TITLE}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_US_PHONE">
                      US PHONE
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_US_PHONE"
                      type="text"
                      value={GOVT_BUS_POC_US_PHONE}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_US_PHONE_EXT">
                      US PHONE EXT
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_US_PHONE_EXT"
                      type="text"
                      value={GOVT_BUS_POC_US_PHONE_EXT}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_NON_US_PHONE">
                      NON US PHONE
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_NON_US_PHONE"
                      type="text"
                      value={GOVT_BUS_POC_NON_US_PHONE}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_FAX_US_ONLY">
                      FAX US ONLY
                    </InputLabel>
                    <Input
                      id="GOVT_BUS_POC_FAX_US_ONLY"
                      type="text"
                      value={GOVT_BUS_POC_FAX_US_ONLY}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="GOVT_BUS_POC_EMAIL">EMAIL</InputLabel>
                    <Input
                      id="GOVT_BUS_POC_EMAIL"
                      type="text"
                      value={GOVT_BUS_POC_EMAIL}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </fieldset>
          </DialogContent>
        ) : (
          <DialogContent className={classes.dialogPlaceholder}>
            <CircularProgress color="inherit" />
            <br />
            <Typography variant="h6">
              Loading Your Vendor. Please Wait!
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button color="secondary" onClick={handleBack}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ display: 'flex' }}>
        <Backdrop className={classes.backdrop} open={isDataLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div>
          <form onSubmit={handleSubmit}>
            <div className={classes.cardVendor}>
              <div>
                <p className={classes.firstPara}>QUICK SEARCH: </p>
                <Grid container spacing={2} className={classes.fullWidth}>
                  <Grid item xs={12} md={4}>
                    <label>Search Vendor: </label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Autocomplete
                      id="asynchronous-vendor"
                      options={options}
                      inputValue={auto}
                      loading={loading}
                      // onInputChange={handleInputChange}
                      onKeyUp={(e) => handleInputChange(e, e.target.value)}
                      onInputChange={(e, v) => setAuto(v)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Vendor name"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <label htmlFor="">DUNS Search: </label>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      id="outlined-number"
                      type="number"
                      placeholder="Enter DUNS number "
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={valueOne}
                      onChange={handleText}
                      className={classes.fullWidth}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <label htmlFor="">NAICS Code Search: </label>

                    <TextField
                      style={{ display: 'flex' }}
                      id="outlined-number"
                      type="text"
                      placeholder="Enter NAICS code "
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      value={naicsCode}
                      onChange={handleNaicsCode}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Autocomplete
                      id="asynchronous-naics-description"
                      options={naicsDescriptionOptions}
                      inputValue={naicsDescriptionKey}
                      loading={naicsloading}
                      onKeyUp={(e) =>
                        handleNAICSDescriptionInputChange(e, e.target.value)
                      }
                      onInputChange={(e, v) => setnaicsDescriptionKey(v)}
                      getOptionSelected={(option, value) =>
                        option.des === value.des
                      }
                      getOptionLabel={(option) => option.des}
                      onChange={(val, newVal) => getSelectedNAICSCode(newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="NAICS Description"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {naicsloading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="contained"
                      className={classes.button}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </form>
        </div>

        <div className={classes.customData}>
          <ButtonGroup
            variant="text"
            color="primary"
            aria-label="text primary button group"
          >
            <Button
              variant={switchTab === '' ? 'contained' : 'outlined'}
              onClick={(e) => {
                setSwitchTab('');
                // tableRef && tableRef.onQueryChange();
              }}
            >
              Vendors
            </Button>
            <Button
              variant={switchTab !== '' ? 'contained' : 'outlined'}
              onClick={(e) => {
                setSwitchTab('yes');
              }}
            >
              DUNS & VENODRS History
            </Button>
          </ButtonGroup>
          <div
            style={{ display: switchTab === '' ? 'block' : 'none' }}
            key="vendor_record"
          >
            <CustomTable
              title="Vendors"
              columns={columns}
              data={getTableData}
              pageSize={pageSize}
              tableRef={(ref) => {
                setTableRef(ref);
              }}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </div>
          <div
            style={{ display: switchTab ? 'block' : 'none' }}
            key="duns_history"
          >
            <CustomTable
              style={{ display: switchTab ? 'block' : 'none' }}
              title="DUNS & VENODRS History"
              columns={columns}
              data={resData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Vendors;
