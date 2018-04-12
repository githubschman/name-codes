import FireBaseTools from '../utils/firebase';
import {
  START_NEW_GAME,
  GET_GAME_STATE,
  UPDATE_MOVES
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {

  case GET_GAME_STATE:
    return action.data;
  case START_NEW_GAME:
    startNewGame(action.data.room, action.data.player, action.data.team);
  case GET_GAME_STATE:
    return Object.assign({}, action.data.gameroom, action.data.moves);
  default:
    return state;
  }
}

function startNewGame(room, player, team) {
  return FireBaseTools.startNewGame(room, player, team);
}
