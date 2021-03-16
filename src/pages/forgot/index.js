import React, { useState } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import backgroundImage from '../../assests/image_1.jpg';
import ForgotModal from '../../components/modals/ForgotModal';

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
}));

const ForgotPage = (props) => {
  const classes = useStyles();

  const { history } = props;
  const query = props.match.params.query;

  const [gotoLogin, setGotoLogin] = useState(false);
  
  const goToLogin = () => {
    setGotoLogin(true);
  };

  if (gotoLogin) {
    
    return <Redirect to="/login" />;
  }

    return (
      <div className={classes.wrapper}>
        <img src={backgroundImage} className={classes.background} alt="background" />
        <ForgotModal handleForgotRequest={goToLogin} handleBackpage={goToLogin} query={query}/>
      </div>
    );
};

ForgotPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ForgotPage;
