import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUserData } from '../../pages/user/utility/models/user.model';

const initialState: any = {
  token: null,
  subjectId: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    setSubjectId: (state, action: PayloadAction<string>) => {
      state.subjectId = action.payload;
    },
    setUser: (state, action: PayloadAction<IUserData>) => {
      state.user = action.payload;
    },
  },
});
// export const isAuthSelector = (state: { auth: { user: null; }; }) => state.auth.user !== null;
export const { setToken, setSubjectId, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
