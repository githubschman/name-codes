import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame  } from '../actions/firebase_actions';


class NewGame extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            gameroom: '',
            playerName: '',
            team: 'red'
        };
    }

    onFormSubmit(event) {
        event.preventDefault();
        // redirects to gameroom:
        let roomName = this.state.gameroom;
        let gameroomRoute = '/game/' + roomName + '/' + this.state.playerName + '/' + this.state.team;

        this.props.startNewGame(({room: this.state.gameroom, player: this.state.playerName, team: this.state.team}));
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

    render() {
        return (
            <div className="col-md-4">
                <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
                    <h2>Create a New Game!</h2>
                    <div className="form-group">
                        <label htmlFor="txtEmail">Enter the Name of Your Game Room</label>
                        <input
                          value={this.state.gameroom} onChange={this.handleGameroomChange} 
                          className="form-control" id="txtEmail" ref="email" placeholder="Gameroom Name"
                          name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtEmail">Enter Your Name</label>
                        <input
                          value={this.state.playerName} onChange={this.handleNameChange} 
                          className="form-control" id="txtEmail" ref="email" placeholder="My Name"
                          name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtPass">What Team are you Playing On?</label>
                        <select value={this.state.team} onChange={this.handleTeamChange} >
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
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
