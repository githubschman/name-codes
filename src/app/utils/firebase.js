import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

const FireBaseTools = {

  /**
   * PUSH USER TO GAMEROOM
   *
   */
    startNewGame: (room, player, team) => {
        // add player to gameroom
        // if they're the first person on their team, they are the clue-giver 
        firebaseApp.database().ref('games/').update({[room]: '??'});
    },

    /**
     * Get the firebase database reference.
     *
     * @param path {!string|string}
     * @returns {!firebase.database.Reference|firebase.database.Reference}
     */
    getDatabaseReference: path => firebaseDb.ref(path),
};

export default FireBaseTools;
