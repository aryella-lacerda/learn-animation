/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  usePanGestureHandler,
  translate,
  withOffset,
  withDecay,
  diffClamp,
} from 'react-native-redash/lib/module/v1';

const { useCode, block, cond, set, eq, add, or } = Animated;
const { height } = Dimensions.get('window');

const App: () => React$Node = () => {
  const horizontalHandler = React.createRef();
  const verticalHandler = React.createRef();

  const [enableX, setEnableX] = React.useState<1 | 0>(1);
  const [enableY, setEnableY] = React.useState<1 | 0>(1);

  const translationX = new Animated.Value(0);
  const velocityX = new Animated.Value(0);
  const stateX = new Animated.Value(State.UNDETERMINED);

  const translationY = new Animated.Value(0);
  const velocityY = new Animated.Value(0);
  const stateY = new Animated.Value(State.UNDETERMINED);

  useCode(
    () =>
      block([
        cond(
          or(
            // if (stateX === State.END || stateY === State.END)
            eq(stateY, State.END),
          ),
          [
            set(translationY, 0), // translationY = 0
          ],
        ),
        cond(
          or(
            // if (stateX === State.END || stateY === State.END)
            eq(stateX, State.END),
          ),
          [
            set(translationX, 0), // translationY = 0
          ],
        ),
      ]),
    [],
  );

  const _handleX = Animated.event([
    {
      nativeEvent: {
        translationX: translationX,
        state: stateX,
        velocityX: velocityX,
      },
    },
  ]);

  const _handleY = Animated.event([
    {
      nativeEvent: {
        translationY: translationY,
        state: stateY,
        velocityY: velocityY,
      },
    },
  ]);

  const onHandlerStateChangeX = _handleX;
  const onGestureEventX = _handleX;
  const onHandlerStateChangeY = _handleY;
  const onGestureEventY = _handleY;

  // const {
  //   gestureHandler: verticalGestureHander,
  //   translation: verticalTranslation,
  //   velocity: verticalVelocity,
  //   state: verticalState,
  // } = usePanGestureHandler();

  // const {
  //   gestureHandler: horizontalGestureHander,
  //   translation: horizontalTranslation,
  //   velocity: horizontalVelocity,
  //   state: horizontalState,
  // } = usePanGestureHandler();

  const minX = -100; // Minimum # of pixels to move vertically. Moving up requires setting this to a negative number.
  const maxX = 0; // Maximum # of pixels to move vertically.

  const translateX = diffClamp(
    // withDecay({
    //   value: translationX,
    //   velocity: velocityX,
    //   state: stateX,
    // }),
    translationX,
    minX,
    maxX,
  );

  const minY = -200; // Minimum # of pixels to move vertically. Moving up requires setting this to a negative number.
  const maxY = 0; // Maximum # of pixels to move vertically.

  const translateY = diffClamp(
    // withDecay({
    //   value: translationY,
    //   velocity: velocityY,
    //   state: stateY,
    // }),
    translationY,
    minY,
    maxY,
  );

  return (
    <View style={styles.container}>
      <PanGestureHandler
        enabled={translateX === 0}
        ref={verticalHandler}
        onHandlerStateChange={onHandlerStateChangeY}
        onGestureEvent={onGestureEventY}
        simultaneousHandlers={horizontalHandler}>
        <Animated.View>
          <PanGestureHandler
            // enabled={translateY === 0}
            ref={horizontalHandler}
            onHandlerStateChange={onHandlerStateChangeX}
            onGestureEvent={onGestureEventX}
            simultaneousHandlers={verticalHandler}>
            <Animated.View
              style={[
                styles.ball,
                { transform: [{ translateX }, { translateY }] },
              ]}
            />
          </PanGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    height: 80,
    aspectRatio: 1,
    backgroundColor: 'red',
    borderRadius: 500,
  },
});

export default App;
