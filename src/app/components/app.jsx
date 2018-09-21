import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../actions/firebase_actions';

import { fadeIn } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';

const animations = StyleSheet.create({
  fadein: {
    animationName: fadeIn,
    animationDuration: '4s'
  },
});

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (      
      <div>
        <header className="top" id="top" role="banner">
          <div>
            <div className="navbar-header">
              <div className="navbar-brand">
              <span className={css([animations.fadein])}>
                <Link to="/">> Name Codes</Link>
              </span>
              </div>
              </div>
                <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
                  <div className="nav navbar-nav navbar-right play-button">
                      <span className={css([animations.fadein])}>
                        <Link to="/play">Play</Link>
                      </span>
                  </div>
                </nav>
          </div>
        </header>

        <div className="game-container">
         {this.props.children}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUser }, dispatch);
}


function mapStateToProps(state) {
  return { gameState: state.gameState };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
