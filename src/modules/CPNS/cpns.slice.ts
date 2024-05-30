import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUCpns, CpnsState } from './cpns.typeDefs';

const initialState: CpnsState = {
  cpns: undefined,
};

const slice = createSlice({
  name: 'cpns',
  initialState,
  reducers: {
    setCpns: (state: CpnsState, { payload }: PayloadAction<IUCpns | undefined>) => {
      state.cpns = payload;
    },
    reset: () => initialState,
  },
});

export function useCpnsSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ cpns }: State) => cpns);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
