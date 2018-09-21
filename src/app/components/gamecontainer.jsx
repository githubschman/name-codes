import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initGameState, chooseCard, takeTurn, acceptGameOver, sendNewTick, localUserData  } from '../actions/firebase_actions';
import { firebaseDb } from '../utils/firebase';
import Chat from './chat.jsx';


import { slideInDown, slideOutUp } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';

const animations = StyleSheet.create({
    slidedown: {
      animationName: slideInDown,
      animationDuration: '1s'
    }
  });
  
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
            firstTeam: '',
            gameOver: false,
            whosTurn: '',
            clue: {word: '?', num: 0},
            activeClue: {word: '?', num: 0},
            isTimed: false,
            secondsLeft: null,
            showTurnButton: false,
            originalTime: 0,
            copied: false,
            showControlPanel: false,
            redTeamMembers: [],
            blueTeamMembers: [],
        };
        this.ref = firebaseDb.ref(`games/${this.props.params.gameroom}`);
        this.ref.on('value', this.onChange.bind(this));
    }

    onChange(snapshot) {
        if (!snapshot || snapshot.val() == null) return;
        let gameState = snapshot.val();

        let blueMaster = gameState.blue ? gameState.blue.filter(member => member.type !== 'normal') : [];
        let redMaster = gameState.red ? gameState.red.filter(member => member.type !== 'normal') : [];
        let advantage = gameState.blueSpots.length > gameState.redSpots.length ? 'blue' : 'red';
        let whosTurn = gameState.currentTurn == null ? advantage : gameState.currentTurn;
        let secLeft = this.state.secondsLeft;

        if (secLeft == null || (!gameState.tick || gameState.tick < 0)) {
            // reset to original time
            secLeft = (gameState.timer * 1000) * 60;
        } else if (gameState.tick) {
            secLeft = gameState.tick;
        }

        this.setState({ gameState: this.state.gameState == null ? gameState : this.state.gameState, 
                        team: this.props.params.team,
                        redTeamMembers: gameState.red,
                        blueTeamMembers: gameState.blue,
                        isMaster: this.determineIfMaster(gameState),
                        blueMaster: blueMaster, 
                        redMaster: redMaster, 
                        moves: gameState.moves, 
                        spaceClasses: gameState.spaceClasses, 
                        firstTeam: advantage,
                        whosTurn: whosTurn,
                        isTimed: gameState.timer > 0,
                        originalTime:  (gameState.timer * 1000) * 60,
                        secondsLeft: secLeft,
                        activeClue: { word: gameState.activeWord, num: gameState.activeNum },
                        gameOver: gameState.gameOver || this.state.gameState ? this.state.gameState.gameOver : false });
        this.props.init({room: this.props.params.gameroom});
    }

    componentDidMount() {
        // look at params
        const { gameroom, player, team } = this.props.params;
        // dispatch get game state
        this.props.init({room: gameroom});
        this.setState({team: team})
        this.props.setUpPlayer({player, team, gameroom});
    }

    determineIfMaster = (initialGameState) => {
        let id = this.props.params.playerId;
        let playerObj = initialGameState[this.props.params.team] ? initialGameState[this.props.params.team].find(member => member.id === id) : null;

        if (playerObj && playerObj.type === 'normal') {
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
            // 
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
        if (!this.state.isMaster && this.state.team === this.state.whosTurn) {
            // only players (not spymasters) can make selections
            let className = this.determineClassName(cardNum);
            let dead = className === 'word-button dead-spot' ? true : false;
            this.props.playerChoice(cardNum, this.props.params.gameroom, dead);
        }
    }

    acceptFate = () => {
        this.props.initGameOver(this.props.params.gameroom);
    }

    handleActiveClue = (event) => {
        this.setState({clue: 
                        { word: event.target.id === 'word' ? event.target.value : this.state.clue.word,
                          num:  event.target.id === 'num' ? Number(event.target.value) : this.state.clue.num }
                    });
    }

    takeYourTurn = (event) => {
        event.preventDefault();
        this.props.takeTurnSwitchTeams(this.props.params.gameroom, this.state.clue.word, this.state.clue.num, this.state.whosTurn)
        if (this.state.isTimed) {
            this.setState({timerTicking: true});
            let interval = setInterval(() => {
                this.props.sendTick(this.state.secondsLeft - 1000, this.props.params.gameroom);
                this.setState({secondsLeft: this.state.secondsLeft - 1000});
                if (this.state.secondsLeft <= 0) {
                    clearInterval(interval);
                    this.setState({timerTicking: false, secondsLeft: this.state.originalTime});
                    this.resetTurn();
                }
            }, 1000);
        } else {
            this.props.sendTick(1000, this.props.params.gameroom);
            this.setState({showTurnButton: true})
        }
    }

    resetTurn() {
        this.props.takeTurnSwitchTeams(this.props.params.gameroom, '', '', this.state.whosTurn === 'red' ? 'blue' : 'red');
        if (!this.state.isTimed) {
            this.setState({showTurnButton: false});
        }
    }

    toggleControlPanel = () => {
        this.setState({showControlPanel: !this.state.showControlPanel});
    }

    brieflyDisplayCopy = () => {
        let crazySolution = document.createElement('textarea')
        crazySolution.innerText = this.props.params.gameroom;
        document.body.appendChild(crazySolution)
        crazySolution.select()
        document.execCommand('copy')
        crazySolution.remove();
        this.setState({copied: true});
        setTimeout(() => {
            this.setState({copied: false});
        }, 3000);
    }

    render() {
        return (
            <div className={this.state.whosTurn}>

                {this.state.showControlPanel ? <div className={css([animations.slidedown])}> 
                    <div className="control-panel">
                        <div className="alias-display">
                            <span className="green-text">Your Alias:</span> {this.state.isMaster ? `${this.props.params.player}, a spy master for the ${this.state.team} team.` : `${this.props.params.player} on the ${this.state.team} team.`} <br />
                            <span className="green-text">Secret Code to Join:</span> <span id="roomcode"> {this.props.params.gameroom} </span>
                            <button className="normalbutton" onClick={this.brieflyDisplayCopy}>Copy to clipboard</button>
                            {this.state.copied ? <p>copied!</p> : null} 
                            <br />
                        </div>
                        <div className="master-display"> 
                            <ul className="spy-list"><span className="green-text">Blue Team:</span>

                            {this.state.blueTeamMembers.length ? this.state.blueTeamMembers.map(member => {
                                if (this.state.blueMaster.find(master => master.id === member.id)) {
                                    return <li> {member.name} (master) </li>
                                }
                                else {
                                    return <li> {member.name} </li>
                                }
                            })  : <li>none</li>}
                            </ul>

                            <ul className="spy-list"><span className="green-text">Red Team:</span>

                            {this.state.redTeamMembers.length ? this.state.redTeamMembers.map(member => {
                                if (this.state.redMaster.find(master => master.id === member.id)) {
                                    return <li> {member.name} (master) </li>
                                }
                                else {
                                    return <li> {member.name} </li>
                                }
                            })  : <li>none</li> }

                            </ul>
                        </div>
                    </div>
                    <button className="normalbutton"  onClick={() => this.toggleControlPanel()}>Hide ▲</button>
                </div>  
                : <button className="normalbutton" onClick={() => this.toggleControlPanel()}>Control Panel ▼</button> }

               <div className="board-container">
                    <div className="board">
                            {this.state.gameState && this.state.gameState.words ?
                            this.state.gameState.words.map((word, i) =>
                                <div className="card">
                                    <button key={i} className={this.determineClassName(i)} value="word" onClick={() => this.handleSelection(i)}>{word}</button>
                                </div>
                        ) : null}
                    </div>
                    <div className="chat">
                        <Chat />
                        {this.state.isMaster && this.state.whosTurn === this.state.team && (this.state.secondsLeft <= 0 || this.state.secondsLeft === this.state.originalTime) ? 
                        <div className="clue-section">
                            <form role="form" onSubmit={this.takeYourTurn}>
                                <label>Enter Clue Word</label>
                                <input
                                value={this.state.clue.word} onChange={this.handleActiveClue} 
                                className="form-control" placeholder="ONE WORD!"
                                id="word"
                                />
                                <div className="form-group">
                                <label>Number of Guesses</label>
                                    <input
                                        min="0" max="20"
                                        id="num"
                                        type="number"
                                        value={this.state.clue.num} onChange={this.handleActiveClue} 
                                        className="form-control" placeholder="1"
                                    />
                                </div>
                                <button className="normalbutton" type="submit">Share Clue!</button>
                            </form> 
                            {this.state.secondsLeft > 0 && this.state.secondsLeft !== this.state.originalTime ?
                                <div className="its-time">
                                    <span className="its-clue">{ this.state.activeClue.word }</span>
                                    <span className="its-guesses">{ this.state.activeClue.num } guesses</span>
                                     { this.state.isTimed ? Math.floor(this.state.secondsLeft / 1000) : null }
                                </div> : null}
                            {this.state.showTurnButton && this.state.whosTurn === this.state.team && this.state.isMaster ? 
                                <button onClick={() => this.resetTurn()} className="normalbutton">End Turn</button>
                             : null}


                        </div> : null}
                    </div>
               </div>
            </div>

        );
    }

}

const mapDispatchToProps = function (dispatch) {
    return {
        init(room) {
            dispatch(initGameState(room));
        },
        playerChoice(num, room, choiceType) {
            dispatch(chooseCard(num, room, choiceType));
        },
        initGameOver(room) {
            dispatch(acceptGameOver(room))
        },
        takeTurnSwitchTeams(room, word, num, team) {
            dispatch(takeTurn({room, word, num, team}));
        },
        sendTick(sec, room) {
            dispatch(sendNewTick({sec, room}));
        },
        setUpPlayer(data) {
            dispatch(localUserData(data));
        }
    }
  };
  
function mapStateToProps(state) {
    return { gameState: state.gameState };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
