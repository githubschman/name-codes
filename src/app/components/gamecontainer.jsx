import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame, initGameState, chooseCard, takeTurn, acceptGameOver, sendNewTick  } from '../actions/firebase_actions';
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
            firstTeam: '',
            gameOver: false,
            whosTurn: '',
            clue: {word: '?', num: 0},
            activeClue: {word: '?', num: 0},
            isTimed: false,
            secondsLeft: null,
            timerTicking: false,
            originalTime: 0
        };
        
        this.ref = firebaseDb.ref(`games/${this.props.params.gameroom}`);
        this.ref.on('value', this.onChange.bind(this));
    }

    onChange(snapshot) {
        if (!snapshot || snapshot.val() == null) return;
        let gameState = snapshot.val();

        let playerName = this.props.params.player;
        let yourTeam = this.props.params.team;
        let playerObj = gameState[yourTeam] ? gameState[yourTeam].find(member => member.name === playerName) : {};
        let blueMaster = gameState.blue ? gameState.blue.filter(member => member.type !== 'normal') : [];
        let redMaster = gameState.red ? gameState.red.filter(member => member.type !== 'normal') : [];
        let advantage = gameState.blueSpots.length > gameState.redSpots.length ? 'blue' : 'red';
        let whosTurn = gameState.currentTurn == null ? advantage : gameState.currentTurn;

        let secLeft = this.state.secondsLeft;

        if (secLeft == null || (!gameState.tick || gameState.tick < 0)) {
            console.log('resetting to original time')
            secLeft = (gameState.timer * 1000) * 60;
        } else if (gameState.tick) {
            secLeft = gameState.tick;
        }

        this.setState({ gameState: this.state.gameState == null ? gameState : this.state.gameState, 
                        team: yourTeam,
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
                        gameOver: gameState.gameOver || this.state.gameState ? this.state.gameState.gameOver : false })
    }

    componentDidMount() { //ngoninit
        // look at params
        const { gameroom, player, team } = this.props.params;
        // dispatch get game state
        this.props.init({room: gameroom});
        
        this.setState({team: team})
    }

    determineIfMaster = (initialGameState) => {
        let id = this.props.params.playerId;
        let playerObj = initialGameState[this.props.params.team].find(member => member.id === id);

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
            // this.setState({
            //     team: this.determineTeam(newProps.gameState)
            // })
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
        if (!this.state.isMaster && this.state.team === this.state.whosTurn) {
            // only players can make selections
            this.props.playerChoice(cardNum, this.props.params.gameroom, dead);
        }
    }

    acceptFate = () => {
        this.props.initGameOver(this.props.params.gameroom);
    }

    handleActiveClue = (event) => {
        this.setState({clue: 
                        { word: event.target.id === 'word' ? event.target.value : this.state.clue.word,
                          num:  event.target.id === 'num' ? Number(event.target.value) : this.state.clue.num}})
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
        }
    }

    resetTurn() {
        this.props.takeTurnSwitchTeams(this.props.params.gameroom, '', '', this.state.whosTurn === 'red' ? 'blue' : 'red');
    }

    copyToClipboard = () => {

    }

    render() {
        return (
            <div className={this.state.whosTurn}>
               {// this.state.gameOver ? 
               // <div>
                // <h1> accept ur fate </h1>
               //  <button onClick={this.acceptFate}>okay</button>
               //</div> : null
                }
               <h1>Secret Code to Join: <span id="roomcode"> {this.props.params.gameroom} </span> </h1> <button onClick={this.copyToClipboard}>copy to clipboard</button>
               <p>{this.state.firstTeam} goes first</p>
                {this.state.isMaster && this.state.whosTurn === this.state.team && !this.state.timerTicking ? 
                <form id="" role="form" onSubmit={this.takeYourTurn}>
                    <label>Enter Your Clue Word</label>
                    <input
                    value={this.state.clue.word} onChange={this.handleActiveClue} 
                    className="form-control" placeholder="ONE WORD!"
                    id="word"
                    />
                    <div className="form-group">
                    <label>How Many Guesses?</label>
                        <input
                            min="0" max="20"
                            id="num"
                            type="number"
                            value={this.state.clue.num} onChange={this.handleActiveClue} 
                            className="form-control" placeholder="1"
                        />
                    </div>
                    <button type="submit" className="btn btn-default btn-block">Share Clue!</button>
                </form> : null}

                {(this.state.secondsLeft > 0 && this.state.secondsLeft !== this.state.originalTime) ?
                    <div>
                        <h1>{ this.state.activeClue.word } { this.state.activeClue.num } </h1>
                         {Math.floor(this.state.secondsLeft / 1000)}
                    </div> : null}

               <div className="gameInfo">
               <h4>The Blue Masters</h4>
               {this.state.blueMaster.length ? this.state.blueMaster.map(master => {
                   return <p> { master.name } </p>
               }) : null }
               <h4>The Red Masters</h4>
                {this.state.redMaster.length ? this.state.blueMaster.map(master => {
                   return <p> { master.name } </p>
               }) : null }
               </div>
               <p>{this.state.isMaster ? `(YOU ARE A CLUE GIVER! for ${this.state.team} )` : 'You are a normal player and not a clue giver'}</p>
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
        },
        takeTurnSwitchTeams(room, word, num, team) {
            dispatch(takeTurn({room, word, num, team}));
        },
        sendTick(sec, room) {
            dispatch(sendNewTick({sec, room}));
        }
    }
  };
  
function mapStateToProps(state) {
    return { gameState: state.gameState };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
