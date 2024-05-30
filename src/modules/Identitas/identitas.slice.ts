import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUIdentitas, IdentitasState } from './identitas.typeDefs';

const initialState: IdentitasState = {
  identitas: undefined,
};

const slice = createSlice({
  name: 'identitas',
  initialState,
  reducers: {
    setIdentitas: (state: IdentitasState, { payload }: PayloadAction<IUIdentitas | undefined>) => {
      state.identitas = payload;
    },
    reset: () => initialState,
  },
});

export function useIdentitasSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ identitas }: State) => identitas);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
