import firebase from 'firebase';
import { FIREBASE_CONFIG } from '../config';

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

const FireBaseTools = {

  /**
   * PUSH USER TO GAMEROOM
   * 
   * return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  // ...
});
   *
   */
    startNewGame: (room, player, team) => {
        // add player to gameroom
        // if they're the first person on their team, they are the clue-giver 
        let redArr = [];
        let blueArr = [];

        firebaseApp.database().ref(`games/${room}`).once('value')
            .then(snapshot => snapshot.val())
            .then(gameRoom => {
                console.log(gameRoom)
                if (team === 'red') {
                    redArr.push(player);
                } else {
                    blueArr.push(player);
                }
                if (!gameRoom) {
                    // room doesnt exist
                    firebaseApp.database().ref(`games/${room}`).set({
                        'red': redArr,
                        'blue': blueArr
                    })
                } else {
                    // room exists
                    firebase.database().ref(`games/${room}`).update({
                        'red': gameRoom.red ? [...gameRoom.red, ...redArr] : redArr,
                        'blue': gameRoom.blue ? [...gameRoom.blue, ...blueArr] : blueArr,
                    })
                    
                }
            }) //;
        return {};
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
