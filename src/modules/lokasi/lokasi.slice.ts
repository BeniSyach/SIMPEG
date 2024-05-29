import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUlokasi, LokasiState } from './lokasi.typeDefs';

const initialState: LokasiState = {
  lokasi: undefined,
};

const slice = createSlice({
  name: 'lokasi',
  initialState,
  reducers: {
    setLokasi: (state: LokasiState, { payload }: PayloadAction<IUlokasi | undefined>) => {
      state.lokasi = payload;
    },
    reset: () => initialState,
  },
});

export function useLokasiSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ lokasi }: State) => lokasi);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
