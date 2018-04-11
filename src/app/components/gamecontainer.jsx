import React, { Component } from 'react';
import { browserHistory, Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startNewGame  } from '../actions/firebase_actions';


class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() { //ngoninit
        const { match: { params } } = this.props;
        this.setState({ user });
      }



    render() {
        return (
            <div className="col-md-4">
               <h1> WELCOME TO THE GAME!@!!!!!</h1>
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

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
