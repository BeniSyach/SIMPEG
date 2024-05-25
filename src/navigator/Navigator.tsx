import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useAppSlice, useAppService, IUser } from '@modules/app';
import BottomSheet from '@components/BottomSheet';
import { WelcomeBottomSheetContents } from '@layouts/BottomSheetContents';
import DrawerNavigator from './drawer';
import { loadImages, loadFonts } from '@theme';
import { useDataPersist, DataPersistKeys } from '@hooks';
import { isWeb } from '@utils/deviceInfo';
import TabNavigator from './tab/Tab';
import { LoginStackNavigator } from './stack';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Navigator() {
  const { getUser } = useAppService();
  const { dispatch, checked, loggedIn, setUser, setLoggedIn } = useAppSlice();
  const { getPersistData } = useDataPersist();
  const [isOpen, setOpen] = useState(true);
  const [isReady, setReady] = useState(false);

  /**
   * preload assets and user data
   */
  const preload = async () => {
    try {
      // preload assets
      await Promise.all([loadImages(), loadFonts()]);

      // fetch user data from persistent storage
      const storedUser = await getPersistData<IUser>(DataPersistKeys.USER);
      if (storedUser) {
        dispatch(setUser(storedUser));
        dispatch(setLoggedIn(!!storedUser));
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
