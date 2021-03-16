import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import { showToast } from '../../redux/actions/toast';
import LoginModal from '../../components/modals/LoginModal';
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

const Login = (props) => {
  const classes = useStyles();

  const { history, showToast } = props;

  const [error, setError] = useState(false);

  const [required, setRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (userInfo) => {
    setError(false);
    setRequired(false);

    const { userId, password } = userInfo;

    if (userId !== '' && password !== '') {
      Axios.post('/auth/login', userInfo)
        .then((res) => {
          if (res.data.status) {
            window.localStorage.setItem(
              'token',
              JSON.stringify(res.data.data.token),
            );
            Axios.defaults.headers.common = {
              Authorization: `Bearer ${res.data.data.token}`,
            };
            // login(res.data.data);
            history.push({
              pathname: '/verification',
              state: { user: res.data.data },
            });
          } else if (res.data.status === false) {
            setError(true);
            setErrorMessage(res.data.message);
            showToast({ type: 'error', message: res.data.message });
          }
        })
        .catch((err) => {
          setError(true);
          showToast({ type: 'error', message: 'Please try again' });
        });
    } else {
      setRequired(true);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <img
          src={backgroundImage}
          className={classes.background}
          alt="background"
        />
        <LoginModal
          handleLogin={handleLogin}
          error={error}
          errorMessage={errorMessage}
          requiredField={required}
        />
      </div>
    </>
  );
};

Login.propTypes = {
  history: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    showToast,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(Login);
