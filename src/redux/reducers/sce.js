import actionTypes from '../actionTypes';

const INITIAL_STATE = []

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_SCPE:
      return [...state, action.payload.doc]

    case actionTypes.ADD_SCPE_BULK:
      return [...action.payload.docs]

    case actionTypes.UPDATE_SCPE:
      return [
        ...state.filter(d => d.sc_duns_no !== action.payload.doc.sc_duns_no), 
        action.payload.doc
      ]
    default:
      return state;
  }
};