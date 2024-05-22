import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  LoginStack: undefined;
  HomeStack: undefined;
  DetailsStack: { from: string };
  ProfileStack: undefined;
  // add more screen props...
};

export type StackProps = NativeStackScreenProps<StackParamList, keyof StackParamList>;
