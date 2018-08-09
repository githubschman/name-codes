import {
  GET_USER_INFO,
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {

  case GET_USER_INFO:
    return Object.assign({},  action.data);
  default:
    return state;
  }
}
