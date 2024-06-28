import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ISearch {
  pendingUserSearchQuery: string,
  approveUserSearchQuery:string,
  rejectedUserSearchQuery:string
}

const initialState : ISearch = {
  pendingUserSearchQuery: '',
  approveUserSearchQuery:'',
  rejectedUserSearchQuery:''
};
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPendingUserSearchQuery: (state, action:PayloadAction<string>) => {
      state.pendingUserSearchQuery = action.payload;
    },
    setApprovedUserSearchQuery:(state, action:PayloadAction<string>)=>{
      state.approveUserSearchQuery = action.payload
    },
    setRejectedUserSearchQuery:(state, action:PayloadAction<string>)=>{
      state.rejectedUserSearchQuery = action.payload
    },

  },
});

export const {setPendingUserSearchQuery , setApprovedUserSearchQuery, setRejectedUserSearchQuery} = searchSlice.actions;
export const searchReducer = searchSlice.reducer;