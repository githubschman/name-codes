import {
  START_NEW_GAME
} from './types';

export function startNewGame(data) {  
  return {
      type: START_NEW_GAME,
      data
  };
}
