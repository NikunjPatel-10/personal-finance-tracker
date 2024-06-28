import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ILoading {
  isLoading: boolean;
}

const initialState: ILoading = {
  isLoading: false,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;
export const loaderReducer = loaderSlice.reducer;
