import React, { useState } from 'react';
import {
  Pressable,
  PressableProps,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import ImageComponent from '../Image'; // Pastikan path ini sesuai dengan lokasi file Image
import { colors } from '@theme';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // w-full
    backgroundColor: '#10B981', // bg-green-500
    paddingVertical: 8, // py-2
    paddingHorizontal: 16, // px-4
    borderRadius: 12, // rounded-lg
  },
  buttonText: {
    color: '#FFFFFF', // text-white
    fontWeight: '600', // font-semibold
  },
  buttonPressed: {
    backgroundColor: '#059669', // bg-green-600
  },
  buttonFocus: {
    borderWidth: 2, // focus:ring-2
    borderColor: '#6EE7B7', // focus:ring-green-300
  },
  opacityDisabled: {
    opacity: 0.6, // Disabled opacity
  },
});

export interface ButtonProps extends Omit<PressableProps, 'title' | 'onPress'> {
  title?: string;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
  loaderColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  titleStyle,
  image,
  style,
  disabled,
  isLoading,
  loaderColor = colors.white,
  imageStyle,
  children,
  onPress,
  ...others
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !isLoading && onPress) {
      onPress(event);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        pressed && styles.buttonPressed,
        isPressed && styles.buttonFocus,
        disabled && styles.opacityDisabled,
        style,
      ]}
      disabled={disabled ?? isLoading}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...others}>
      {children}
      {isLoading && <ActivityIndicator size="small" color={loaderColor} />}
      {!isLoading && image && <ImageComponent source={image} style={imageStyle} />}
      {!isLoading && title && <Text style={[styles.buttonText, titleStyle]}>{title}</Text>}
    </Pressable>
  );
};

export default Button;
