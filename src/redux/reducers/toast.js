import actionTypes from '../actionTypes';

const INITIAL_STATE = {
  open: false,
  type: '',
  message: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SHOW_MESSAGE:
      return {
        open: true,
        type: action.payload.type,
        message: action.payload.message,
      };
    case actionTypes.HIDE_MESSAGE:
      return {
        open: false,
        type: '',
        message: '',
      };
    default:
      return state;
  }
};
