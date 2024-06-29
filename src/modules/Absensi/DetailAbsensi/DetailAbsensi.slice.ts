import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUDetailAbsensi, DetailAbsensiState } from './DetailAbsensi.typeDefs';

const initialState: DetailAbsensiState = {
  Detailabsensi: undefined,
};

const slice = createSlice({
  name: 'Detailabsensi',
  initialState,
  reducers: {
    setAbsensi: (
      state: DetailAbsensiState,
      { payload }: PayloadAction<IUDetailAbsensi | undefined>,
    ) => {
      state.Detailabsensi = payload;
    },
    reset: () => initialState,
  },
});

export function useDetailAbsensiSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ Detailabsensi }: State) => Detailabsensi);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
