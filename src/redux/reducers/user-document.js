import actionTypes from "../actionTypes";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_DOC:
      return [...state, action.payload.doc];

    case actionTypes.ADD_BULK_DOC:
      return [...action.payload.docs];

    case actionTypes.REPLACE_DOC:
      return [
        ...state.map((d) =>
          d._id !== action.payload.doc._id ? d : action.payload.doc
        ),
      ];

    default:
      return state;
  }
};
