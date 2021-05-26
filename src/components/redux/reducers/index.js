import { combineReducers } from 'redux';
import counterReducer from './counters';
import loggedReducer from './isLogged';

const allReducers = combineReducers({
  counter: counterReducer,
  logged: loggedReducer
});

export default allReducers;
