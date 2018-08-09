import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import LocalUserReducer from './local_user_reducer';

const rootReducer = combineReducers({
    gameState: FireBaseUserReducer,
    currentPlayer: LocalUserReducer
});

export default rootReducer;
