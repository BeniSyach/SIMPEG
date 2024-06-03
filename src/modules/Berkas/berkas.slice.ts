import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUBerkas, BerkasState } from './berkas.typeDefs';

const initialState: BerkasState = {
  berkas: undefined,
};

const slice = createSlice({
  name: 'berkas',
  initialState,
  reducers: {
    setBerkas: (state: BerkasState, { payload }: PayloadAction<IUBerkas | undefined>) => {
      state.berkas = payload;
    },
    reset: () => initialState,
  },
});

export function useBerkasSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ berkas }: State) => berkas);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
