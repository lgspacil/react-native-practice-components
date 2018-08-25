import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
// distance required as a threshold
const SWIPE_THRESHOLD = 0.30 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250

class Deck extends Component {
  // if the user does not pass in a prop we can pass in a defult prop and use this funtion
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      // anytime the user presses down on a screen 
      onStartShouldSetPanResponder: () => true,
      // called anytime the user drags their finger around the screen
      // callled many many times
      onPanResponderMove: (event, gesture) => {
        // setting the position of the card as the user moves thier finger
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      // anytime the user legs go of the screen
      onPanResponderRelease: (event, gesture) => {
        // look at how much the user has liked or disliked
        if(gesture.dx > SWIPE_THRESHOLD){
          this.forceSwipe('right');
        } else if(gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPostion();
        }
      }
    });

    this.state = {
      panResponder,
      position,
      index: 0
    };
  }

  // called when component will recieve new props if you pass in more cards
  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
      //if we have a new set of cards/data we should reset the index to start from the first card of the new deck
      this.setState({index: 0});
    }
  }

  componentWillUpdate() {
    // specifically for androiod
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    // this means that every time the app will update itselft and rerender simply spring to it
    LayoutAnimation.spring();
  }

  forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.state.position, {
      toValue: {x: x, y: 0},
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete = (direction) => {
    // destructering the props
    const { onSwipeRight, onSwipeLeft, data } = this.props;

    const item = data[this.state.index];
    // a prop called on the parent that can handle what to do when the user swipes left or righ
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    // reset the postion of the next card
    this.state.position.setValue({x: 0, y: 0})

    // update the state index
    this.setState({index: this.state.index + 1})
  }

  resetPostion = () => {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  //helper method for styling
  getCardStyle = () => {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate: rotate }]
    }
  }


  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }

      if (i === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }

      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5 }]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      );
    }).reverse();
  }

  render() {
    return (
      // spreading all the properties and passing them to the view
      <View>
        {this.renderCards()}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
})

export default Deck;