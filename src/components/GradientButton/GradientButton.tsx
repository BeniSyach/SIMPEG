import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import Button, { ButtonProps } from '../Button';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export interface GradientButtonProps extends Omit<ButtonProps, 'style'> {
  gradientBackgroundProps: LinearGradientProps;
  gradientBackgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  gradientBackgroundProps,
  gradientBackgroundStyle,
  style,
  ...buttonProps
}) => {
  const { title } = buttonProps; // Mendapatkan title dari buttonProps
  return (
    <Button {...buttonProps} style={[styles.root, style]}>
      <LinearGradient
        {...gradientBackgroundProps}
        style={[styles.gradientBackground, gradientBackgroundStyle]}
      />
    </Button>
  );
};

export default GradientButton;
