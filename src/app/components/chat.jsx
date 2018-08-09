import React, { Component } from 'react';
import { firebaseDb } from '../utils/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendChat  } from '../actions/firebase_actions';

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameroom: '',
            chats: [],
            pendingMessage: '',
        };
    }

    componentDidMount() { 

    }

    componentWillReceiveProps(newProps) {
        if (newProps && newProps.gameState) {
            this.setState({chats: newProps.gameState.chats});
            console.log(newProps.gameState.chats);
        }
    }

    writingNewMessage = (event) => {
        this.setState({pendingMessage: event.target.value});
    }


    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.emitMessage(this.state.pendingMessage, this.props.player.player, this.props.player.gameroom);
        this.setState({pendingMessage: ''});
    }

   
    render() {
        return (
            <div className="col-md-4">
                <div>{this.state.chats && this.state.chats.map(chat => {
                    return <div>{chat.name} : {chat.content} </div>
                })}</div>
                <form role="form" onSubmit={this.onFormSubmit}>
                    <div className="form-group">
                        <input
                          value={this.state.pendingMessage} onChange={this.writingNewMessage} 
                          className="form-control" placeholder="write message"
                        />
                    </div>
                    <button type="submit" className="btn btn-default btn-block">emit message</button>
                    <br />
                </form>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return {        
        emitMessage(content, name, room) {
            dispatch(sendChat({content, name, room}));
        }
    }
}

function mapStateToProps(state) {
    return { gameState: state.gameState, player: state.currentPlayer };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
