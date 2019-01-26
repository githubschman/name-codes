import { firebaseDb } from '../utils/firebase';
import {
  START_NEW_GAME,
  GET_GAME_STATE,
  UPDATE_MOVES,
  GAME_OVER_ACCEPTED,
  GET_USER_INFO
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

export function gameOverAccepted(data) {  
  return {
      type: GAME_OVER_ACCEPTED,
      data
  };
}

export function getLocalUserInfo(data) {  
  return {
      type: GET_USER_INFO,
      data
  };
}


export const initGameState = data => dispatch => {
  firebaseDb.ref(`games/${data.room}`).once('value')
    .then(snapshot => snapshot.val())
    .then(gameRoom => dispatch(getGameState(gameRoom)))
    .catch(console.error)
}

export const takeTurn = data => dispatch => {
  const { room, word, num, team } = data;
  firebaseDb.ref(`games/${room}`).once('value')
  .then(snapshot => snapshot.val())
  .then(gameRoom => {
    firebaseDb.ref(`games/${room}`).update({
      'currentTurn': team, // team == 'reds' ? 'blue' : 'reds',
      'activeWord': word,
      'activeNum': num
    });
    dispatch(getGameState(gameRoom));
  })
  .catch(console.error)
}

export const sendNewTick = data => dispatch => {
  const { room, sec } = data;
  firebaseDb.ref(`games/${room}`).once('value')
  .then(snapshot => snapshot.val())
  .then(gameRoom => {
    firebaseDb.ref(`games/${room}`).update({
      'tick': sec
    });
    dispatch(getGameState(gameRoom));
  })
  .catch(console.error)
}

export const chooseCard = (num, room, dead, guesses) => dispatch => {
  firebaseDb.ref(`games/${room}`).once('value')
    .then(snapshot => snapshot.val())
    .then(gameRoom => {
      let newMoves = [...gameRoom.moves];
      newMoves[num] = true;
      gameRoom.gameOver = dead;
      const newGuesses = guesses - 1;
      firebaseDb.ref(`games/${room}`).update({
        'moves': newMoves,
        'gameOver': dead,
        'activeNum': newGuesses
      });
      dispatch(getGameState(gameRoom));
    })
    .catch(console.error)
}

export const sendChat = (data) => dispatch => {
  const {content, name, room} = data;
  firebaseDb.ref(`games/${room}`).once('value')
    .then(snapshot => snapshot.val())
    .then(gameRoom => {
      let newChat = [...gameRoom.chats, {content: content, name: name}];
      gameRoom.chats = newChat;
      firebaseDb.ref(`games/${room}`).update({
        'chats': newChat,
      });
      dispatch(getGameState(gameRoom));
    })
    .catch(console.error)
}

export const acceptGameOver = (roomName) => dispatch => {
  firebaseDb.ref(`games`).once('value')
    .then(snapshot => snapshot.val())
    .then(room => {
      firebaseDb.ref('games').child(roomName).remove();
      // TODO: if gamestate is null, show stats?
    })
    .catch(console.error)
}

export const localUserData = data => dispatch => {
  dispatch(getLocalUserInfo(data));
}