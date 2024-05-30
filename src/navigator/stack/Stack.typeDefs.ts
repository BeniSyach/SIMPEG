import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  LoginStack: undefined;
  HomeStack: undefined;
  DetailsStack: { from: string };
  ProfileStack: undefined;
  LokasiStack: { from: string };
  IdentitasStack: { from: string };
  CpnsStack: { from: string };
  // add more screen props...
};

export type StackProps = NativeStackScreenProps<StackParamList, keyof StackParamList>;
