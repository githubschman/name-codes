import {
  REGISTER_FIREBASE_USER,
  START_NEW_GAME,
  UPDATE_FIREBASE_USER,
  CHANGE_FIREBASE_USER_PASSWORD,
  FIREBASE_PASSWORD_RESET_EMAIL,
  LOGOUT_FIREBASE_USER,
} from './types';

export function startNewGame(data) {  
  return {
      type: START_NEW_GAME,
      data
  };
}
