import FireBaseTools from '../utils/firebase';
import {
  START_NEW_GAME,
} from '../actions/types';


export default function (state = null, action) {
  switch (action.type) {

  case START_NEW_GAME:
    return startNewGame(action.data.room, action.data.player, action.data.team);

  default:
    return state;
  }
}

function startNewGame(room, player, team) {
  return FireBaseTools.startNewGame(room, player, team);
}