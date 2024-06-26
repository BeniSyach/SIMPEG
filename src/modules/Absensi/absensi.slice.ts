import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUAbsensi, AbsensiState } from './absensi.typeDefs';

const initialState: AbsensiState = {
  absensi: undefined,
};

const slice = createSlice({
  name: 'absensi',
  initialState,
  reducers: {
    setAbsensi: (state: AbsensiState, { payload }: PayloadAction<IUAbsensi | undefined>) => {
      state.absensi = payload;
    },
    reset: () => initialState,
  },
});

export function useBerkasSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ absensi }: State) => absensi);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
