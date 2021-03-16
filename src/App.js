import React, { useCallback, useEffect, useState } from 'react';
import { Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import Snackbar from '@material-ui/core/Snackbar';
import { hideToast } from './redux/actions/toast';
import { login } from './redux/actions/auth';

import PublicRoute from './routes/PublicRoute';
import NeutralRoute from './routes/NeutralRoute';
import Login from './pages/login';
import SignUpPage from './pages/signup';
import ForgotPage from './pages/forgot';
import ResetPage from './pages/reset';
import Dashboard from './pages/dashboard';
import PrivateRoute from './routes/PrivateRoute';
import SubContractorForm from './pages/subcontractor';
import ProfilePage from './pages/profile';
import ActiveScreen from './pages/active';
import ChangePasswordScreen from './pages/changepassword';
import VerificationScreen from './pages/verification';

import { Axios } from './utils/axios';
import Alert from './components/alert';

import './App.css';

function App(props) {
  const { user, login, toast, hideToast, history } = props;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    const authUser = window.localStorage.getItem('authUser');
    if (token && authUser) {
      Axios.defaults.headers.common = {
        Authorization: `Bearer ${JSON.parse(token)}`,
      };

      Axios.get('/auth/verify-token')
        .then((res) => {
          setLoading(false);
          if (res.data.code !== 200) {
            history.replace('/login');
          } else {
            login(JSON.parse(authUser));
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    hideToast();
  }, [hideToast]);

  return !loading ? (
    <div className="app-container">
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toast.open}
        onClose={handleClose}
        key={new Date().toLocaleString()}
      >
        <Alert onClose={handleClose} severity={toast.type}>
          {toast.message}
        </Alert>
      </Snackbar>
      <Switch>
        <NeutralRoute
          exact
          path="/form/:id"
          component={SubContractorForm}
          props={props}
        />
        <Redirect exact from="/" to="/dashboard" />
        <PublicRoute exact path="/login" component={Login} props={props} />
        <PublicRoute
          exact
          path="/sign-up"
          component={SignUpPage}
          props={props}
        />
        <PublicRoute
          exact
          path="/forgot/:query"
          component={ForgotPage}
          props={props}
        />
        <PublicRoute
          exact
          path="/reset/:token"
          component={ResetPage}
          props={props}
        />
        <PublicRoute
          exact
          path="/active/:id"
          component={ActiveScreen}
          props={props}
        />
        <PublicRoute
          exact
          path="/change-password"
          component={ChangePasswordScreen}
          props={props}
        />
        <PublicRoute
          exact
          path="/verification"
          component={VerificationScreen}
          props={null}
        />
        <PrivateRoute
          exact
          path="/dashboard"
          component={Dashboard}
          props={{ user }}
        />
        <PrivateRoute
          exact
          path="/dashboard/profile"
          component={ProfilePage}
          props={{ user }}
        />
      </Switch>
    </div>
  ) : (
    ''
  );
}

App.propTypes = {
  user: PropTypes.object,
  toast: PropTypes.object,
  history: PropTypes.object,
  hideToast: PropTypes.func.isRequired,
};

App.defaultProps = {
  user: null,
  toast: {
    type: '',
    open: false,
    message: '',
  },
  history: {},
};

const mapStateToProps = (store) => ({
  user: store.authData.user,
  toast: store.toast,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      hideToast,
      login,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
