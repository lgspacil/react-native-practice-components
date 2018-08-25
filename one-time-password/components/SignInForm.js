import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import axios from 'axios';
import firebase from 'firebase';

const ROOT_URL = 'https://us-central1-one-time-password-ab3e3.cloudfunctions.net';

class SignInForm extends Component {
    state = {
        phone: '',
        code: '',
        error: false
    };

    handleSubmit = async () => {
        try {
            // destructure the response to grab the data object
            let { data } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, {
                phone: this.state.phone,
                code: this.state.code
            })
            // authenticate the user and the user can call firebase anywhere else in the app
            firebase.auth().signInWithCustomToken(data.token);

            this.setState({error: false});

        } catch (err) {
            console.log(err);
            this.setState({ error: true });
        }
    }

    render() {
        let error;
        if (this.state.error) {
            error = <Text style={{ color: 'red' }}>Something went wrong</Text>
        }
        return (
            <View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}} >Sign In</Text>
                <View style={{ marginBottom: 10 }}>
                    <FormLabel>Enter Phone Number</FormLabel>
                    <FormInput
                        value={this.state.phone}
                        onChangeText={phone => this.setState({ phone: phone })} />
                </View>
                <View style={{ marginBottom: 10 }}>
                    <FormLabel>Enter Code</FormLabel>
                    <FormInput
                        value={this.state.code}
                        onChangeText={code => this.setState({ code: code })} />
                </View>
                <Button
                    title="Submit"
                    onPress={this.handleSubmit} />
                {error}
            </View>
        );
    }
}

export default SignInForm;