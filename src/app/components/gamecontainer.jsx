import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame, initGameState, chooseCard, acceptGameOver  } from '../actions/firebase_actions';
import { firebaseDb } from '../utils/firebase';


class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMaster: false,
            team: '',
            blueMaster: [],
            redMaster: [],
            gameState: null,
            moves: [],
            spaceClasses: [],
            team: '',
            firstTeam: '',
            gameOver: false
        };
        
        this.ref = firebaseDb.ref(`games/${this.props.params.gameroom}`);
        this.ref.on('value', this.onChange.bind(this));
    }

    onChange(snapshot) {
        if (!snapshot || !snapshot.val()) return;
        let gameState = snapshot.val();

        let playerName = this.props.params.player;
        let yourTeam = this.props.params.team;
        let playerObj = gameState[yourTeam].find(member => member.name === playerName);
        console.log(playerObj)
        let blueMaster = gameState.blue ? gameState.blue.filter(member => member.type !== 'normal') : [];
        let redMaster = gameState.red ? gameState.red.filter(member => member.type !== 'normal') : [];

        console.log(playerObj.type)
        if (playerObj.type !== 'normal') {
            this.setState({isMaster: true})
        }

        if (this.state.gameState == null) {
            this.setState({gameState: gameState})
        }
        if (this.state.gameState.gameOver) {
            console.log('setting to game over!!!!')
            this.setState({gameOver: true});
        }
        console.log('gamestate', this.props.gameState);
        this.setState({team: yourTeam, blueMaster: blueMaster, redMaster: redMaster, moves: gameState.moves, spaceClasses: gameState.spaceClasses, firstTeam: gameState.blueSpots.length > gameState.redSpots.length ? 'blue' : 'reds'})
    }

    componentDidMount() { //ngoninit
        // look at params
        const { gameroom, player, team } = this.props.params;
        // dispatch get game state
        this.props.init({room: gameroom});
        
        this.setState({team: team})
    }

    determineIfMaster = () => {
        let playerName = this.props.params.player;
        let team = this.state.team;
        let playerObj = gameState[team].find(member => member.name === playerName);

        if (playerObj.type === 'normal') {
            return false;
        } else {
            return true;
        }
    }

    determineTeam = (gameState) => {
        let playerName = this.props.params.player;
        if (gameState.blue && gameState.blue.find(member => member.name === playerName)) {
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
        let className = this.determineClassName(cardNum);
        let dead = className === 'word-button dead-spot' ? true : false;
        if (!this.state.isMaster) {
            // only players can make selections
            this.props.playerChoice(cardNum, this.props.params.gameroom, dead);
        }
    }

    acceptFate = () => {
        this.props.initGameOver(this.props.params.gameroom);
    }

    render() {
        return (
            <div>
               {this.state.gameOver ? 
               <div>
                <h1> accept ur fate </h1>
                <button onClick={this.acceptFate}>okay</button>
               </div> : null}
               <h1>Welcome to {this.props.params.gameroom}</h1>
               <p>{this.state.firstTeam} goes first</p>
               <div className="gameInfo">
               {this.state.blueMaster.length ? this.state.blueMaster.map(master => {
                   return <p> { master.name } </p>
               }) : null }
                {this.state.redMaster.length ? this.state.blueMaster.map(master => {
                   return <p> { master.name } </p>
               }) : null }
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
        playerChoice(num, room, choiceType) {
            dispatch(chooseCard(num, room, choiceType));
        },
        initGameOver(room) {
            dispatch(acceptGameOver(room))
        }
    }
  };
  
function mapStateToProps(state) {
    return { gameState: state.gameState };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
