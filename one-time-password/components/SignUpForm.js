import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import axios from 'axios';

const ROOT_URL = 'https://us-central1-one-time-password-ab3e3.cloudfunctions.net';

class SignUpForm extends Component {
    state = {
        phone: '',
        error: false
    };

    handleSubmit = async () => {
        try {
            await axios.post(`${ROOT_URL}/createUser`, { phone: this.state.phone });
            //after stage 1 we need to make a follow up request to be sent to the users phone  
            await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone: this.state.phone });
            this.setState({error: false});
        } catch (err) {
            console.log(err);
            this.setState({
                error: true
            });
        }
    }

    render() {
        let error;
        if(this.state.error){
            error  = <Text style={{ color: 'red' }}>Something went wrong</Text>
        }
        return (
            <View>
                <Text style={{fontSize: 20, fontWeight: 'bold'}} >Sign Up</Text>
                <View style={{ marginBottom: 10 }}>
                    <FormLabel>Enter Phone Number</FormLabel>
                    <FormInput
                        value={this.state.phone}
                        onChangeText={phone => this.setState({ phone: phone })} />
                </View>
                <Button
                    title="Submit"
                    onPress={this.handleSubmit} />
                {error}
            </View>
        );
    }
}

export default SignUpForm;