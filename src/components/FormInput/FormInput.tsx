import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { colors } from '@theme';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
  },
});

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  style,
  labelStyle,
  inputStyle,
  errorStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle, error ? { borderColor: colors.black } : null]}
        {...props}
      />
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

export default FormInput;
