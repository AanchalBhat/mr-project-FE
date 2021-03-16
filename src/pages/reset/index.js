import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Redirect } from 'react-router';

import backgroundImage from '../../assests/image_1.jpg';
import ResetModal from '../../components/modals/ResetModal';

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

const ResetPage = (props) => {
  const classes = useStyles();

  const { history } = props;
  
  const [gotoLogin, setGotoLogin] = useState(false);
  const goToLogin = () => {
    setGotoLogin(true);
  };

  if (gotoLogin) {
    history.push('/login');
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.wrapper}>
      <img src={backgroundImage} className={classes.background} alt="background" />
      <ResetModal handleResetRequest={goToLogin} token={props.match.params.token}/>
    </div>
  );
};

ResetPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ResetPage;
