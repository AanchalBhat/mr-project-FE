import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authData from './auth';
import sce from './sce';
import userDocument from './user-document';
import toast from './toast';

export default (history) => combineReducers({
  router: connectRouter(history),
  authData,
  sce,
  userDocument,
  toast,
});
