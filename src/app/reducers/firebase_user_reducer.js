import FireBaseTools from '../utils/firebase';
import {
  START_NEW_GAME,
  GET_GAME_STATE,
  GAME_OVER_ACCEPTED
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {

  case GET_GAME_STATE:
    return action.data;
  case START_NEW_GAME:
    startNewGame(action.data.room, action.data.player, action.data.team, action.data.master, action.data.timer, action.data.id);
  case GAME_OVER_ACCEPTED:
    return Object.assign({},  action.data);
  default:
    return state;
  }
}

function startNewGame(room, player, team, master, timer, id) {
  return FireBaseTools.startNewGame(room, player, team, master, timer, id);
}
