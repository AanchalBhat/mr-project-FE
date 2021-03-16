import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import { login } from '../../redux/actions/auth';
import { showToast } from '../../redux/actions/toast';
import VerificationScreenModal from '../../components/modals/VerificationScreenModal';
import backgroundImage from '../../assests/image_1.jpg';
import { Axios } from '../../utils/axios';

const useStyles = makeStyles((theme) => ({
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

const Verification = (props) => {
  const classes = useStyles();

  const {
    history, login, showToast, location,
  } = props;
  const [error, setError] = useState(false);

  const [required, setRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = (code) => {
    setError(false);
    setRequired(false);


    if (code !== '') {
      Axios.defaults.headers.common = {
        Authorization: `Bearer ${location.state.user.token}`,
      };
      Axios.post('/auth/verifyMFA', { code })
        .then((res) => {
          if (res.data.status) {
            window.localStorage.setItem(
              'authUser',
              JSON.stringify(res.data.data),
            );
            login(res.data.data);
            history.replace('/dashboard');
            showToast({ type: 'success', message: 'You are logged in successfully.' });
          } else if (res.data.status === false) {
            setError(true);
            setErrorMessage(res.data.message);
            showToast({ type: 'error', message: res.data.message });
          }
        })
        .catch(() => {
          setError(true);
          showToast({ type: 'error', message: 'Please try again later.' });
        });
    } else {
      setRequired(true);
    }
  };

  const handleSendCode = (type) => {
    Axios.post('/auth/sendMFACode', { type })
      .then((res) => {
        if (res.data.status) {
          showToast({ type: 'success', message: 'The verification code has been sent.' });
        } else if (res.data.status === false) {
          setError(true);
          setErrorMessage(res.data.message);
          showToast({ type: 'error', message: res.data.message });
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  return (
    <>
      <div className={classes.wrapper}>
        <img
          src={backgroundImage}
          className={classes.background}
          alt="background"
        />
        <VerificationScreenModal
          user={location.state.user || {}}
          handleVerify={handleVerify}
          handleSendCode={handleSendCode}
          error={error}
          errorMessage={errorMessage}
          requiredField={required}
        />
      </div>
    </>
  );
};

Verification.propTypes = {
  history: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    login,
    showToast,
  },
  dispatch,
);


export default connect(null, mapDispatchToProps)(Verification);
