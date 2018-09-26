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

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      titleFull: '> NAME CODES',
      title: '',
      explanationFull: ' it\'s like the tabletop game codenames \n but somehow different... \n because it\'s online \n \n other than that it\'s pretty much the same \n SQL> DROP DATABASE meaingOfLifeDB; \n lol jk this isnt a real terminal \n or is it?! \n \n \n anyway, have fun playing name codes! \n TLR is the hax 4 lyfe!',
      explanation: '',
      optionsFull: ['rules', 'play'],
      options: ['','']
    }
    this.triangleInterval = null;
  }
  
  componentDidMount() {
    setTimeout(() => {
      let tIndex = 0;
      let titleLen = this.state.titleFull.length;
      let eIndex = 0;
      let expLen = this.state.explanationFull.length;

      let titleInterval = setInterval(() => {
        if (tIndex >= titleLen) {
          clearInterval(titleInterval);
        } else {
          this.setState({title: this.state.title + this.state.titleFull[tIndex]});
          tIndex++;
        }
      }, 100);

      let explanationInterval = setInterval(() => {
        let intermish = false;
        if (tIndex >= titleLen) {
          if (!intermish) {
            setTimeout(() => {
              if (eIndex < expLen) {
                this.setState({explanation: this.state.explanation + this.state.explanationFull[eIndex]});
                eIndex++;
              } else {
                clearInterval(explanationInterval)
              }
            }, 600)            
          }
        } 
        
      }, 100);


    }, 2000);
  }

  render() {
    return (      
      <div className="home">
        <h1>{this.state.title}</h1>
        {this.state.explanation.length ?
          <h2 className="exp">{this.state.explanation.split("\n").map((sentence, key) => {
            return <div key={key}>name-codes:info$ {sentence}</div>;
          })}</h2>
        : null}
      </div>
    );
  }
}

export default Home;
