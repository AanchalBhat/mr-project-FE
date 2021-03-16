import actionTypes from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const login = (userInfo) => (dispatch) => {
  dispatch({
    type: actionTypes.LOG_IN,
    payload: { user: userInfo },
  });
};

// eslint-disable-next-line import/prefer-default-export
export const logOut = () => (dispatch) => {
  dispatch({
    type: actionTypes.LOG_OUT,
  });
};
