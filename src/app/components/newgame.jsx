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
            gameroom: 'a',
            playerName: 'b',
            team: 'c'
        };
    }

    onFormSubmit(event) {
        event.preventDefault();

        // redirects to gameroom:
        let roomName = this.state.gameroom;
        let gameroomRoute = '/game/:' + roomName;

        this.props.startNewGame(({room: this.state.gameroom, player: this.state.playerName, team: this.state.team}))
            .then(() => {
                this.props.history.push(gameroomRoute);
            })
            .catch(console.error)
    }

    render() {
        return (
            <div className="col-md-4">
                <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
                    <h2>Create a New Game!</h2>
                    <div className="form-group">
                        <label htmlFor="txtEmail">Enter the Name of Your Game Room</label>
                        <input
                          className="form-control" id="txtEmail" ref="email" placeholder="Gameroom Name"
                          name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtEmail">Enter Your Name</label>
                        <input
                          className="form-control" id="txtEmail" ref="email" placeholder="My Name"
                          name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="txtPass">What Team are you Playing On?</label>
                        <select>
                            <option value="east">East Cost</option>
                            <option value="west">West Coast</option>
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
