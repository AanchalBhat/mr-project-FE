import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Redirect } from 'react-router';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import backgroundImage from '../../assests/image_1.jpg';
import SignUpModal from '../../components/modals/SignUpModal';
import { showToast } from '../../redux/actions/toast';
import { login } from '../../redux/actions/auth';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
    height: '100vh',
  },
  background: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const SignUpPage = (props) => {
  const classes = useStyles();

  const { history, showToast } = props;

  const [gotoLogin, setGotoLogin] = useState(false);
  const [gotoSignUp, setGotoSignUp] = useState(false);
  const goToLogin = () => {
    setGotoLogin(true);
  };

  const goToSignUp = () => {
    setGotoSignUp(true);
  };

  if (gotoLogin) {
    history.push('/login');
    return <Redirect to="/login" />;
  }
  if (gotoSignUp) {
    history.push('/login');
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.wrapper}>
      <img src={backgroundImage} className={classes.background} alt="background" />
      <SignUpModal
        handleSignUp={goToLogin}
        handleCreateAccount={goToSignUp}
        handleCancel={goToLogin}
        showToast={showToast}
      />
    </div>
  );
};

const newLocal = PropTypes.object;
SignUpPage.propTypes = {
  history: newLocal.isRequired,
  showToast: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    login,
    showToast,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(SignUpPage);
