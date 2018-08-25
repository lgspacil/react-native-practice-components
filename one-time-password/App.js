import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';

export default class App extends React.Component {

  componentDidMount() {
    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyBYC_OwnH8v-5d7dd3eCFBS4-NosJD0TYA",
      authDomain: "one-time-password-ab3e3.firebaseapp.com",
      databaseURL: "https://one-time-password-ab3e3.firebaseio.com",
      projectId: "one-time-password-ab3e3",
      storageBucket: "one-time-password-ab3e3.appspot.com",
      messagingSenderId: "915340775511"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <View style={styles.container}>
        <SignUpForm />
        <SignInForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
