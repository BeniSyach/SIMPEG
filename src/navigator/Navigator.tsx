import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppSlice, useAppService, IUser } from '@modules/app';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';
import TabNavigator from './tab/Tab';
import { LoginStackNavigator } from './stack';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { login } = useAppService();
  const { dispatch, checked, loggedIn, setUser, setLoggedIn } = useAppSlice();
  const { getPersistData } = useDataPersist();
  const [isReady, setReady] = useState(false);

  /**
   * preload assets and user data
   */
  const preload = async () => {
    try {
      // preload assets
      await Promise.all([loadImages(), loadFonts()]);

      // fetch user data from persistent storage
      const data_user = await getPersistData<IUser>(DataPersistKeys.USER);
      if (data_user) {
        console.log('User data found:', data_user);
      } else {
        console.log('User data not found.');
      }

      const storedUser = await login(data_user?.nik || '', data_user?.password || '');
      console.log('Stored user data:', storedUser);
      if (storedUser) {
        dispatch(setUser(storedUser));
        dispatch(setLoggedIn(true));
      } else {
        dispatch(setLoggedIn(false));
      }

      // hide splash screen
      SplashScreen.hideAsync();
    } catch (err) {
      console.log('[##] preload error:', err);
      dispatch(setLoggedIn(false));

      // hide splash screen
      SplashScreen.hideAsync();
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    preload();
  }, []);

  if (!isReady) {
    return null; // or a loading indicator
  }
  console.log('## loggedIn', loggedIn);
  console.log('## checked', checked);
  return (
    <NavigationContainer>
      {checked && loggedIn ? (
        <>
          <TabNavigator />
          {/* {!isWeb && (
            <BottomSheet isOpen={isOpen} initialOpen>
              <WelcomeBottomSheetContents onClose={() => setOpen(false)} />
            </BottomSheet>
          )} */}
        </>
      ) : (
        <LoginStackNavigator />
      )}
    </NavigationContainer>
  );
}

export default Navigator;
