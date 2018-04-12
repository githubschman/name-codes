import { firebaseDb } from '../utils/firebase';
import {
  START_NEW_GAME,
  GET_GAME_STATE,
  UPDATE_MOVES
} from './types';


export function startNewGame(data) {  
  return {
      type: START_NEW_GAME,
      data
  };
}

export function getGameState(data) {  
  return {
      type: GET_GAME_STATE,
      data
  };
}

export function updateMoves(data) {  
  return {
      type: UPDATE_MOVES,
      data
  };
}

export const initGameState = data => dispatch => {
  firebaseDb.ref(`games/${data.room}`).once('value')
    .then(snapshot => snapshot.val())
    .then(gameRoom => dispatch(getGameState(gameRoom)))
    .catch(console.error)
}

export const chooseCard = (num, room) => dispatch => {
  firebaseDb.ref(`games/${room}`).once('value')
    .then(snapshot => snapshot.val())
    .then(gameRoom => {
      let newMoves = [...gameRoom.moves];
      newMoves[num] = true;
      firebaseDb.ref(`games/${room}`).update({
        'moves': newMoves
      });
      dispatch(updateMoves({gameroom: gameRoom, moves: newMoves}))
    })
    .catch(console.error)
}