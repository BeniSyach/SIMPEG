import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUPangkatGaji, PangkatGajiState } from './PangkatGaji.typeDefs';

const initialState: PangkatGajiState = {
  PangkatGaji: undefined,
};

const slice = createSlice({
  name: 'PangkatGaji',
  initialState,
  reducers: {
    setPangkatGaji: (
      state: PangkatGajiState,
      { payload }: PayloadAction<IUPangkatGaji | undefined>,
    ) => {
      state.PangkatGaji = payload;
    },
    reset: () => initialState,
  },
});

export function usePangkatGajiSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ PangkatGaji }: State) => PangkatGaji);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
