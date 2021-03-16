import actionTypes from '../actionTypes';

const INITIAL_STATE = {
  user: null,
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOG_IN:
      return {
        ...state,
        user: action.payload.user,
      };

    case actionTypes.LOG_OUT:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};
