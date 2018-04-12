import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame, initGameState, chooseCard  } from '../actions/firebase_actions';
import { firebaseDb } from '../utils/firebase';


class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMaster: null,
            team: '',
            blueMaster: false,
            redMaster: false,
            gameState: null,
            moves: [],
            spaceClasses: [],
            team: '',
            firstTeam: ''
        };
        
        this.ref = firebaseDb.ref(`games/${this.props.params.gameroom}`);
        this.ref.on('value', this.onChange.bind(this));
    }

    onChange(snapshot) {
        if (!snapshot || !snapshot.val()) return;
        let gameState = snapshot.val();

        // blue master has joined
        if (!this.state.blueMaster && gameState.blue) {
            this.setState({blueMaster: gameState.blue[0]})
        }
        // red master has joined 
        if (!this.state.redMaster && gameState.red) {
            this.setState({redMaster: gameState.red[0]})
        }

        if (this.state.isMaster === null) {
            this.setState({isMaster: this.determineIfMaster(gameState.blue || [], gameState.red || [])})
        }
        if(this.state.gameState == null) {
            this.setState({gameState: gameState})
        }
        this.setState({moves: gameState.moves, spaceClasses: gameState.spaceClasses, firstTeam: gameState.blueSpots.length > gameState.redSpots.length ? 'blue' : 'reds'})
    }

    componentDidMount() { //ngoninit
        // look at params
        const { gameroom, player, team } = this.props.params;
        // dispatch get game state
        this.props.init({room: gameroom});
        
        this.setState({team: team})
    }

    determineIfMaster = (blue, red) => {
        if ((blue && blue[0] === this.props.params.player) || (red && red[0] === this.props.params.player)) {
            return true;
        } else if((!blue.length  && this.state.team === 'blue') || (!red.length && this.state.team === 'red')) {
            return true;
        } else {
            return false;
        }
    }

    determineTeam = (gameState) => {
        let player = this.props.params.player;
        if (gameState.blue && gameState.blue.includes(player)) {
            return 'blue';
        } else {
            return 'red';
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps && newProps.gameState) {
            this.setState({
                team: this.determineTeam(newProps.gameState)
            })
        }
    }

    determineClassName = (i) => {
        if (this.state.isMaster) {
            // return entire class list
            let went = this.state.moves[i] ? ' overlay' : '';
            return this.state.spaceClasses[i] + ' word-button' + went;
        } else {
            // determine if move has been made, then return class list
            let playerClass = this.state.moves[i] ? this.state.spaceClasses[i] : '';
            return 'word-button ' + playerClass;
        }
    }

    handleSelection = (cardNum) => {
        if (!this.state.isMaster) {
            // only players can make selections
            this.props.playerChoice(cardNum, this.props.params.gameroom);
        }
    }

    render() {
        return (
            <div>
               <h1>Welcome to {this.props.params.gameroom}</h1>
               <p>{this.state.firstTeam} goes first</p>
               <div className="gameInfo">
                <h3>Team Blue Clue Giver: {this.state.blueMaster ? this.state.blueMaster : '-'}</h3>
                <h3>Team Red Clue Giver: {this.state.redMaster ? this.state.redMaster : '-'}</h3>
               </div>
               <p>{this.state.isMaster ? '(YOU ARE A CLUE GIVER!)' : 'You are a normal player and not a clue giver'}</p>
               <div className="board">
                    {this.state.gameState && this.state.gameState.words ?
                    this.state.gameState.words.map((word, i) =>
                        <div className="card">
                            <button key={i} className={this.determineClassName(i)} value="word" onClick={() => this.handleSelection(i)}>{word}</button>
                        </div>
                ) : null}
               </div>
            </div>

        );
    }

}

const mapDispatchToProps = function (dispatch) {
    return {
        init(room){
            dispatch(initGameState(room));
        },
        playerChoice(num, room) {
            dispatch(chooseCard(num, room));
        }
    }
  };
  
function mapStateToProps(state) {
    return { gameState: state.gameState };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
