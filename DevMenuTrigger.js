import React from 'react';
import { View, PanResponder, NativeModules } from 'react-native';

const DevMenuTrigger = ({ children }) => {
  const { DevMenu } = NativeModules;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.numberActiveTouches === 3) {
        DevMenu.show();
      }
    },
  });
  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

export default DevMenuTrigger;
