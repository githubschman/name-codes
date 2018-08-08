import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../actions/firebase_actions';
import FireBaseTools from '../utils/firebase'

console.log(FireBaseTools.getDatabaseReference);

class App extends Component {

  constructor(props) {
    super(props);
  }

  _renderUserMenu(gameState) {
    // if current user exists and user id exists than make user navigation
    if (gameState && gameState.uid) {
      return (
        <li className="dropdown">
          <a
            href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
            aria-haspopup="true" aria-expanded="false"
          > {gameState.email}<span className="caret" />
          </a>
          <ul className="dropdown-menu">
            <li><Link to="/profile">Profile</Link></li>
            <li role="separator" className="divider" />
            <li><Link to="/logout" onClick={() => this._logOut}>Logout</Link></li>
          </ul>
        </li>
      );
    } else {
      return [
        <li key={1}><Link to="/play">Play</Link></li>,
      ];
    }
  }

  render() {
    return (      
      <div>
        <header className="navbar navbar-static-top navbar-inverse" id="top" role="banner">
          <div>
            <div className="navbar-header">
              <button
                className="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <Link to="/" className="navbar-brand">Namecodes</Link>
              </div>
              <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
                <ul className="nav navbar-nav">
                  <li><Link to="/"> Home</Link></li>,
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    { this._renderUserMenu(this.props.gameState) }
                </ul>
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
