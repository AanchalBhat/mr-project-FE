import actionTypes from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const add_evaluation = (scpe) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_SCPE,
    payload: { doc: scpe },
  });
};

export const add_evaluation_bulk = (scpe) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_SCPE_BULK,
    payload: { docs: scpe },
  });
};

export const update_evaluation = (scpe) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_SCPE,
    payload: { doc: scpe },
  });
};


