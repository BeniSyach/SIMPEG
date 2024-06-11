import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from './Stack.typeDefs';
import { StackHeaderTitle } from './components';
import { colors } from '@theme';

// views
import Login from '@views/Login';
import Home from '@views/Home';
import Details from '@views/Details';
import Profile from '@views/Profile';
import Lokasi from '@views/Lokasi';
import Identitas from '@views/Identitas';
import Cpns from '@views/Cpns';
import Pns from '@views/PNS';
import PangkatGaji from '@views/PangkatGaji';
import Berkas from '@views/Berkas';
import User from '@views/User';
import Absensi from '@views/Absensi';
import DetailAbsensi from '@views/DetailAbsensi';

const Stack = createNativeStackNavigator<StackParamList>();

const navigationProps = {
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
};

export function LoginStackNavigator() {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Login}
        name="LoginStack"
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Home}
        name="HomeStack"
        // options={{
        //   title: 'Home',
        //   headerTitle: () => <StackHeaderTitle />,
        //   // headerLeft: () => <StackHeaderLeft onPress={() => navigation.toggleDrawer()} />,
        //   headerTitleAlign: 'center',
        // }}
        options={{
          headerShown: false,
          title: 'Home',
        }}
      />
      <Stack.Screen
        component={Details}
        name="DetailsStack"
        options={{
          title: 'Details',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Login}
        name="LoginStack"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={Berkas}
        name="BerkasStack"
        options={{
          title: 'Berkas',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={User}
        name="UserStack"
        options={{
          title: 'User',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Absensi}
        name="AbsensiStack"
        options={{
          title: 'Absensi',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={DetailAbsensi}
        name="DetailAbsensiStack"
        options={{
          title: 'Detail Absensi',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Profile}
        name="ProfileStack"
        options={{
          title: 'Profile',
          headerTitle: () => <StackHeaderTitle />,
          // headerLeft: () => <StackHeaderLeft onPress={() => navigation.toggleDrawer()} />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Details}
        name="DetailsStack"
        options={{
          title: 'Details',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Login}
        name="LoginStack"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={Lokasi}
        name="LokasiStack"
        options={{
          title: 'Lokasi',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Identitas}
        name="IdentitasStack"
        options={{
          title: 'Identitas',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Cpns}
        name="CpnsStack"
        options={{
          title: 'CPNS',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Pns}
        name="PnsStack"
        options={{
          title: 'PNS',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={PangkatGaji}
        name="PangkatGajiStack"
        options={{
          title: 'Pangkat Gaji',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={User}
        name="UserStack"
        options={{
          title: 'User',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}
