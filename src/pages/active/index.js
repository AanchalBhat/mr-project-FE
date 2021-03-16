import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { login } from '../../redux/actions/auth';
import { showToast } from '../../redux/actions/toast';

import ActiveScreenModal from '../../components/modals/ActiveScreenModal';

import backgroundImage from '../../assests/image_1.jpg';

import { Axios } from '../../utils/axios';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 10,
    alignItems: 'center',
    textAlign: 'center',
  },
  description: {
    marginTop: '100px',
  },
  button: {
    marginTop: '20px',
  },
  wrapper: {
    width: '100%',
    height: '100vh',
  },
  background: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ActiveScreen = (props) => {
  const classes = useStyles();

  const { history, showToast } = props;

  const [error, setError] = useState(false);

  const [required, setRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorField, setErrorField] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(0);

  useEffect(() => {
    Axios.get(`/user/active/${props.match.params.id}`)
      .then((res) => {
        setIsLoading(false);
        console.log(res);
        if (!res.data.status) {
          showToast({ type: 'error', message: res.data.message });
          setCode(res.data.code);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        showToast({ type: 'error', message: 'This link is not validate. Please contact system admin to activate your account.' });
        setCode(1);
      });
  }, []);

  const handleActive = (userInfo) => {
    console.log(userInfo);
    if (!props.match.params.id) return;
    setError(false);
    setRequired(false);

    const { userId, password, email } = userInfo;

    if (userId !== '' && password !== '' && email !== '') {
      Axios.post(`/user/active/${props.match.params.id}`, userInfo)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            showToast({ type: 'success', message: res.data.message });
            history.replace('/login');
          } else if (res.data.status === false) {
            setError(true);
            setErrorMessage(res.data.message);
            setErrorField(res.data.errorField);
            showToast({ type: 'error', message: res.data.message });
          }
        })
        .catch(() => {
          setError(true);
        });
    } else {
      setRequired(true);
    }
  };

  if (isLoading) {
    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    );
  }
  if (code === 1) {
    return (
      <div className={classes.root}>
        <div className={classes.description}>
          This link is not valid. Please contact system admin to activate your account.
        </div>
        <Button className={classes.button} variant="contained" color="primary" onClick={() => history.push('/login')}>
          Contact System Admin
        </Button>
      </div>
    );
  }
  if (code === 2) {
    return (
      <div className={classes.root}>
        <div className={classes.description}>
          You have already activated the account. Please login with your username and password.
        </div>
        <Button className={classes.button} variant="contained" color="primary" onClick={() => history.push('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }
  return (
    <>
      <div className={classes.wrapper}>
        <img
          src={backgroundImage}
          className={classes.background}
          alt="background"
        />
        <ActiveScreenModal
          handleActive={handleActive}
          error={error}
          errorMessage={errorMessage}
          errorField={errorField}
          requiredField={required}
        />
      </div>
    </>
  );
};

ActiveScreen.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  showToast: PropTypes.func.isRequired,
};

ActiveScreen.defaultProps = {
  match: {
    params: { id: '' },
  },
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ login, showToast },
  dispatch);

export default connect(null, mapDispatchToProps)(ActiveScreen);
