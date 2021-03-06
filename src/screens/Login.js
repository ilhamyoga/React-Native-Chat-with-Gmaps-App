import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, TouchableOpacity, View, Image, ScrollView, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements'
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Input } from 'react-native-elements';

import firebase from 'firebase';
import User from '../../User';
import GetLocation from 'react-native-get-location'

export default class Login extends Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    }
    this.getLocation();
  }

  handleChange = key => val => {
    this.setState({ [key]: val })
  }

  getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
        })
    })
    .catch(error => {
        alert('Get location error')
    })
  }

  updateLocation = async() => {
    console.warn(this.state.latitude)
    let updates = {};
     
    let containt = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };

    updates['users/' + User.uid + '/location'] = containt;
    firebase.database().ref().update(updates);
  }

  onPressLogin = async () => {
    this.setState({ isLoading: true})
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((response)=>{
        User.uid = response.user.uid
        AsyncStorage.setItem('userUid', User.uid);
        this.updateLocation();

        this.setState({ isLoading: false})
        this.props.navigation.navigate('Home')
      })
      .catch(error => {
        alert('Wrong Username & Password')
        this.setState({ isLoading: false})
      })
  };

  render() {
    return (
      <View style={styles.container}>
        { (this.state.isLoading == true) ?
            <View style={styles.modal}>
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
            </View>
            : null
        }
        <ScrollView style={{flex:1}}>
          <View style={{alignItems:'center'}}>
            <Image
              style={styles.logoImage}
              source={ require('../assets/logo_t.png') } 
            />
            <View style={styles.card}>
              { (this.state.isError == true) ?
                <Text style={{color:'red', textAlign:'center'}}>Wrong Username & Password</Text>
                : null
              }
              <View style={{flex:1, marginBottom:10}}>
                <Input
                  inputContainerStyle={{borderBottomColor:'#424E61'}}
                  inputStyle={{color:'#f7a0a4', textAlign:'center'}}
                  onChangeText={this.handleChange('email')}
                  placeholderTextColor='#5A6675'
                  placeholder='Email'
                  leftIcon={
                    <Icon
                      style={{marginLeft:-10}}
                      name='email'
                      size={27}
                      color='#424E61'
                    />
                  }
                />
                {/* { 
                  (this.state.email == 0) ?
                  <Text style={{color:'red', textAlign:'center'}}>Wrong Username & Password</Text>
                  : null
                } */}
              </View>

              <View style={{flex:1, marginBottom:35}}>
                <Input
                  inputContainerStyle={{borderBottomColor:'#424E61'}}
                  inputStyle={{color:'#f7a0a4', textAlign:'center'}}
                  onChangeText={this.handleChange('password')}
                  secureTextEntry={true}
                  placeholderTextColor='#5A6675'
                  placeholder='Password'
                  leftIcon={
                    <Icon
                      style={{marginLeft:-10}}
                      name='lock'
                      size={27}
                      color='#424E61'
                    />
                  }
                />
                { (this.state.password.length < 6 && this.state.password.length > 0 ) ?
                  <Text style={{color:'red', textAlign:'center'}}>minimum password length 6</Text>
                  : null
                }
              </View>
            </View>

            <View style={{width:'81%'}}>
              <Button
                titleStyle={{fontSize:20}}
                buttonStyle={{height:65, backgroundColor:'#F25E63', borderRadius: 5}}
                onPress={this.onPressLogin}
                style={styles.button}
                title="SIGN IN"
              />
            </View>

            <TouchableOpacity
              onPress={() => alert('Coming Soon')}
              style={{marginTop: 25}}
              activeOpacity={0.6}
            >
              <Text style={styles.text}>Forgot your password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}
              style={{marginTop:50, marginBottom:30}}
              activeOpacity={0.6}
            >
              <Text style={styles.text}>Sign Up</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }
}

Login.propTypes = {
  click: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({

  modal : {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  loading: {
    backgroundColor: 'white',
    width: 200,
    height: 100,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },

  container:{
    flex:1,
    backgroundColor:'#2e3745',
  },

  logoImage: {
    height: 320,
    width: 320,
  },

  card:{
    width:'86%',
    justifyContent:'center'
  },

  text: {
    color: '#5A6675',
    fontWeight: '200',
    fontSize: 18,
  }

});