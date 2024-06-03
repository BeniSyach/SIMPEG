import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@utils/store';
import { IUUser, UserState } from './user.typeDefs';

const initialState: UserState = {
  user: undefined,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, { payload }: PayloadAction<IUUser | undefined>) => {
      state.user = payload;
    },
    reset: () => initialState,
  },
});

export function useUserSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ user }: State) => user);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
