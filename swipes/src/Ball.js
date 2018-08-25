import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

class Ball extends Component {
    state = {
        position: new Animated.ValueXY(0, 0)
    }
    componentWillMount() {
        Animated.spring(this.state.position, {
            toValue: {x: 200, y: 500}
        }).start();
        
    }
    render() {
        return (
            <Animated.View style={this.state.position.getLayout()} >
                <View style={styles.ball} />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black'
    }
})

export default Ball;