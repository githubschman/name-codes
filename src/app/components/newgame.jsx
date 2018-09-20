import React, { Component } from 'react';
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
            timer: false,
            time: 1
        };
    }


    onFormSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        if (this.state.newGame) {
            // generate game code
            let i = 0;
            let code = Math.random().toString(36).slice(3,8);               
            this.tryRef = firebaseDb.ref(`games/${code}`);
            this.tryRef.once('value', (snapshot) => {
                if (snapshot.val() == null) {
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
        let id = Math.random().toString(36).substring(7);
        let gameroomRoute = '/game/' + roomName + '/' + (this.state.playerName.length ? this.state.playerName.split(' ').join('') : 'nonamefool') + '/' + this.state.team + '/' + id;
        this.props.startNewGame(({room: roomName, player: this.state.playerName || 'no name fool', team: this.state.team || 'red', master: this.state.master, timer: this.state.timer ? this.state.time : 0, id: id}));
        this.props.history.push(gameroomRoute);
    }

    handleGameroomChange = (event) => {
        this.setState({gameroom: event.target.value});
    }

    handleNameChange = (event) => {
        this.setState({playerName: event.target.value});
    }

    handleTimeChange = (event) => {
        this.setState({time: Number(event.target.value)})
    }

    handleTeamChange = (event) => {
        this.setState({team: event.target.value});
    }

    handleMasterChange = (event) => {
        this.setState({master: event.target.value})
    }
    
    handletimerGame = () => {
        this.setState({timer: !this.state.timer})
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
            <div className="new-game">
                <form role="form" onSubmit={this.onFormSubmit}>
                    <h2 className="green-text">> Create Or Join a Mission</h2>
                    create a new mission <input type="checkbox" checked={this.state.newGame && !this.state.exisitngGame} onChange={() => this.handleToggleNewGame()} /> <span className="green-text"> OR </span>
                    join an existing mission <input type = "checkbox" checked={this.state.existingGame && !this.state.newGame} onChange={() => this.handleShowExistingGame()} />
                    {this.state.existingGame ?             
                        <div className="form-group">
                            <label>Enter the Secret Code</label>
                            <input
                            maxlength="5"
                            minlength="5"
                            value={this.state.gameroom} onChange={this.handleGameroomChange} 
                            className="form-control" placeholder="Secret Code"
                            />
                        </div> : 
                    null}
                    {!this.state.existingGame && this.state.newGame ? <div> timed game<input type = "checkbox" checked={this.state.timer} onChange={() => this.handletimerGame()} /> </div>
                     : null }
                    {this.state.timer && !this.state.existingGame && this.state.newGame ?                     
                        <div className="form-group">
                            <label>minutes per round</label>
                            <input
                            min="1" max="20"
                            type="number"
                            value={this.state.time} onChange={this.handleTimeChange} 
                            className="form-control" placeholder="1"
                            />
                        </div> : null}
                    <div className="form-group">
                        <label>Enter Your Alias</label>
                        <input
                          value={this.state.playerName} onChange={this.handleNameChange} 
                          className="form-control" placeholder="My Alias" required
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
                    <button type="submit" className="btn btn-default btn-block normalbutton">Play!</button>
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
