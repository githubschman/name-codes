import React, { Component } from 'react';
import { firebaseDb } from '../utils/firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendChat  } from '../actions/firebase_actions';
import ReactDOM from 'react-dom';

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameroom: '',
            chats: [],
            pendingMessage: '',
            chatColor: 'green-text',
        };
    }

    scrollToBottom = () => {
        // const node = ReactDOM.findDOMNode(this.messagesEnd);
        // node.scrollIntoView({ behavior: "smooth" });
        const target = ReactDOM.findDOMNode(this.messagesEnd);
        target.parentNode.scrollTop = target.offsetTop;
    }

    componentDidMount() {
        this.scrollToBottom();
        if (this.props && this.props.gameState) {
            let chatColor = 'coral-text';
            if (this.props.gameState.whosTurn === 'blue') {
                chatColor = 'green-text';
            }

            this.setState({chats: this.props.gameState.chats, chatColor});
            this.scrollToBottom();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps && newProps.gameState) {
            let chatColor = 'coral-text';
            if (newProps.gameState.whosTurn === 'blue') {
                chatColor = 'green-text';
            }

            this.setState({chats: newProps.gameState.chats, chatColor});
            this.scrollToBottom();
        }
    }

    writingNewMessage = (event) => {
        this.setState({pendingMessage: event.target.value});
    }


    sendChat = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (this.state.pendingMessage) {
            this.props.emitMessage(this.state.pendingMessage, this.props.player.player, this.props.player.gameroom);
            this.setState({pendingMessage: ''});
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="sent-chats">{this.state.chats && this.state.chats.map(chat => {
                    return <div><span className={this.state.chatColor}>{chat.name}:</span> {chat.content} </div>
                })}
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
                </div>
                <form role="form" onSubmit={this.sendChat}>
                    <div className="form-group">
                        <input
                          value={this.state.pendingMessage} onChange={this.writingNewMessage} 
                          className="form-control" placeholder="write message"
                        />
                    </div>
                    <button type="submit" className="normalbutton">emit message</button>
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
