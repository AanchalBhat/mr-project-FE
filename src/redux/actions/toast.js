import actionTypes from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const showToast = (info) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOW_MESSAGE,
    payload: info,
  });
};

export const hideToast = () => (dispatch) => {
  dispatch({
    type: actionTypes.HIDE_MESSAGE,
  });
};
