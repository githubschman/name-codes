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
            if (this.props.gameState.currentTurn === 'blue') {
                chatColor = 'green-text';
            }
            this.setState({chats: this.props.gameState.chats, chatColor});
            this.scrollToBottom();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps && newProps.gameState) {
            let chatColor = 'coral-text';
            if (newProps.gameState.currentTurn === 'blue') {
                chatColor = 'green-text';
            }
            this.setState({chats: newProps.gameState.chats, chatColor});
            this.scrollToBottom();
        }
    }

    writingNewMessage = (event) => {
        this.setState({pendingMessage: event.target.value});
    }

    didtheyhitenter = (event) => {
        if (event.key === 'Enter') {
            this.sendChat(null);
        }
    }


    sendChat = (event) => {
        if (this.state.pendingMessage) {
            this.props.emitMessage(this.state.pendingMessage, this.props.player.player, this.props.player.gameroom);
            this.setState({pendingMessage: ''});
        }
    }

    sendYikes = () => {
        const yikesArr = ['😳','😟','😖','YIKES','😧', '😨'];
        const rando = Math.floor(Math.random() * yikesArr.length);
        this.props.emitMessage(yikesArr[rando], this.props.player.player, this.props.player.gameroom);
    }

    render() {
        return (
            <div>
                <div className="sent-chats">{this.state.chats && this.state.chats.map(chat => {
                    return <div><span className={this.state.chatColor}>agent-message:{chat.name.split(' ').join('-').toLowerCase()}$</span> {chat.content}</div>
                })}
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
                </div>
                <div>
                    <div className="form-group">
                        <input
                          value={this.state.pendingMessage} 
                          onKeyPress={(e) => this.didtheyhitenter(e)}
                          onChange={this.writingNewMessage} 
                          className="form-control" placeholder="write message"
                        />
                    </div>
                    <button onClick={this.sendChat} className="normalbutton">emit message</button>
                    <button onClick={this.sendYikes} className="normalbutton">yikes</button>
                    <br />
                </div>
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
