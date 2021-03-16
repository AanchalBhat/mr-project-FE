import actionTypes from "../actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const add_document = (doc) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_DOC,
    payload: { doc },
  });
};

export const add_bulk_document = (docs) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_BULK_DOC,
    payload: { docs },
  });
};

export const replace_document = (doc) => (dispatch) => {
  dispatch({
    type: actionTypes.REPLACE_DOC,
    payload: { doc },
  });
};
