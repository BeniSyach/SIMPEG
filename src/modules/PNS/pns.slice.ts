import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUPns, PnsState } from './pns.typeDefs';

const initialState: PnsState = {
  pns: undefined,
};

const slice = createSlice({
  name: 'pns',
  initialState,
  reducers: {
    setPns: (state: PnsState, { payload }: PayloadAction<IUPns | undefined>) => {
      state.pns = payload;
    },
    reset: () => initialState,
  },
});

export function usePnsSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ pns }: State) => pns);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
