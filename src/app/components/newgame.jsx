import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { firebaseDb } from '../utils/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame  } from '../actions/firebase_actions';


class NewGame extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameroom: '',
            playerName: '',
            team: 'red',
            master: 'normal',
            newGame: true,
            existingGame: false,
            timed: false
        };
    }


    onFormSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (this.state.newGame) {
            // generate game code
            let foundEmptyRoom = false;
            let i = 0;
            let code = Math.random().toString(36).substring(7);                
            this.tryRef = firebaseDb.ref(`games/${code}`);
            this.tryRef.once('value', (snapshot) => {
                if (snapshot.val() == null) {
                    foundEmptyRoom = true;
                    this.launchNewGame(code);
                } else {
                    this.onFormSubmit(null);
                }
            });
        
        } else {
            this.launchNewGame();
        }
    }

    launchNewGame = (randomName) => {
        // redirects to gameroom:
        let roomName = randomName ? randomName : this.state.gameroom;
        let gameroomRoute = '/game/' + roomName + '/' + (this.state.playerName.length ? this.state.playerName.split(' ').join('') : 'nonamefool') + '/' + this.state.team;
        console.log(this.state.timed)
        this.props.startNewGame(({room: roomName, player: this.state.playerName || 'no name fool', team: this.state.team || 'red', master: this.state.master, timed: this.state.timed}));
        this.props.history.push(gameroomRoute);
    }

    handleGameroomChange = (event) => {
        this.setState({gameroom: event.target.value});
    }

    handleNameChange = (event) => {
        this.setState({playerName: event.target.value});
    }

    handleTeamChange = (event) => {
        this.setState({team: event.target.value});
    }

    handleMasterChange = (event) => {
        this.setState({master: event.target.value})
    }
    
    handleTimedGame = () => {
        this.setState({timed: !this.state.timed})
    }

    handleToggleNewGame = () => {
        this.setState({newGame: !this.state.newGame, 
                        existingGame: !this.state.newGame === true ? false : this.state.existingGame,
                        gameroom: !this.state.newGame === false ? '' : this.state.gameroom
                        });
    }

    handleShowExistingGame = () => {
        this.setState({
                existingGame: !this.state.existingGame, 
                newGame: !this.state.existingGame === true ? false : this.state.newGame,
                gameroom: !this.state.existingGame === false ? '' : this.state.gameroom})
    }

    render() {
        return (
            <div className="col-md-4">
                <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
                    <h2>Create a New Game!</h2>
                    create a new game <input type="checkbox" checked={this.state.newGame && !this.state.exisitngGame} onChange={() => this.handleToggleNewGame()} />
                    join an existing game <input type = "checkbox" checked={this.state.existingGame && !this.state.newGame} onChange={() => this.handleShowExistingGame()} />
                    {this.state.existingGame ?             
                        <div className="form-group">
                            <label>Enter the Game Code</label>
                            <input
                            value={this.state.gameroom} onChange={this.handleGameroomChange} 
                            className="form-control" id="txtEmail" placeholder="Gameroom Name"
                            />
                        </div> : 
                    null}
                    {!this.state.existingGame && this.state.newGame ? <div> timed game<input type = "checkbox" checked={this.state.timed} onChange={() => this.handleTimedGame()} /> </div>
                     : null }
                    <div className="form-group">
                        <label>Enter Your Name</label>
                        <input
                          value={this.state.playerName} onChange={this.handleNameChange} 
                          className="form-control" id="txtEmail" placeholder="My Name"
                        />
                    </div>
                    <div className="form-group">
                        <label>What Team are you Playing On?</label>
                        <select value={this.state.team} onChange={this.handleTeamChange} >
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Are you a normal player or a spy master?</label>
                        <select value={this.state.master} onChange={this.handleMasterChange} >
                            <option value="master">Spy Master</option>
                            <option value="normal">Normal Guy</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-default btn-block">Play!</button>
                    <br />
                </form>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        startNewGame,
    }, dispatch);
}

function mapStateToProps(state) {
    return { gameState: state.gameState };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
