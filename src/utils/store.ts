import { configureStore } from '@reduxjs/toolkit';
import app from '@modules/app/app.slice';
import lokasi from '@modules/lokasi/lokasi.slice';
import identitas from '@modules/Identitas/identitas.slice';
import cpns from '@modules/CPNS/cpns.slice';
import pns from '@modules/PNS/pns.slice';
import PangkatGaji from '@modules/PangkatGaji/PangkatGaji.slice';
import berkas from '@modules/Berkas/berkas.slice';
import user from '@modules/User/user.slice';
import config from '@utils/config';

const store = configureStore({
  reducer: {
    app,
    lokasi,
    identitas,
    cpns,
    pns,
    PangkatGaji,
    berkas,
    user,
    // add more store ...
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: config.ENV === 'dev',
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export default store;
