import React from 'react';
import { Image } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import User from '../../User';
import firebase from 'firebase';

export default class Chatting extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    // headerTitle: (
    //   <Image
    //       style={{height:20, width:110}}
    //       source={{uri: props.navigation.getParam('avatar')}}
    //   />
    // ),
    title: (navigation.state.params || {}).name || 'Chat!'
  });

  constructor(props) {
    super(props);
    this.state = {
        person: {
          uid: props.navigation.getParam('userUid')
        },
        textMessage: '',
        messageList:[]
    }
  }

  componentDidMount(){
    firebase.database().ref('messages').child(User.uid._55).child(this.state.person.uid)
      .on('child_added',(value)=>{
        this.setState((prevState)=>{
          console.warn(prevState.messageList, value.val())
          return {
            messageList: GiftedChat.append(prevState.messageList, value.val())
          }
        })
      })
  }

  handleChange = key => val => {
    this.setState({ [key]: val })
  }

  sendMessage = async () => {
    let msgId = firebase.database().ref('messages').child(User.uid._55).child(this.state.person.uid).push().key
    let updates  = {}
    let message = {
      _id: msgId,
      text: this.state.textMessage,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      user: {
        _id: User.uid._55,
        name: User.name,
        avatar: User.image
      },
    }
    updates['messages/'+ User.uid._55 + '/' + this.state.person.uid + '/' + msgId] = message 
    updates['messages/'+ this.state.person.uid + '/' + User.uid._55 + '/' + msgId] = message 
    firebase.database().ref().update(updates);
    this.setState({ textMessage: '' });
  }

  render() {
    return (
      <GiftedChat
        text={this.state.textMessage}
        messages={this.state.messageList}
        user={{
            _id : User.uid._55
        }}
        onInputTextChanged={this.handleChange('textMessage')}
        onSend={this.sendMessage}
      />
    );
  }
}