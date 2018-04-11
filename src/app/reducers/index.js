import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';

const rootReducer = combineReducers({
    gameState: FireBaseUserReducer,
});

export default rootReducer;
