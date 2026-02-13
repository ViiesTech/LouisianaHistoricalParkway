import { createSlice } from '@reduxjs/toolkit';
import { Apis } from '../services';

const initialState = {
  token: null,
  user: {},
  guest: null, // stores guest object
  isGuest: false,
  // profileCreated: false,
};

export const Slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = {};
      state.token = null;
      state.guest = null;
      state.isGuest = false;
    },
    logoutGuest: state => {
      state.guest = null;
      state.isGuest = false;
      state.token = null;
      state.user = {};
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(Apis.endpoints.register.matchFulfilled, (state, action) => {
        console.log('aaaaa', action);
        if (action.payload?.token) {
          console.log('accc', action);
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addMatcher(Apis.endpoints.login.matchFulfilled, (state, action) => {
        console.log('acttttssss', action);
        if (action.payload?.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addMatcher(
        Apis.endpoints.loginAsGuest.matchFulfilled,
        (state, action) => {
          console.log('acttttssss', action);
          if (action.payload?.guest) {
            state.guest = action.payload.guest;
            state.token = action.payload.token;
            state.isGuest = true;
          }
        },
      )
      .addMatcher(
        Apis.endpoints.updateProfile.matchFulfilled,
        (state, action) => {
          console.log('acttttssss.payload', action.payload);
          if (action.payload?.data) {
            state.user = action.payload.data;
          }
        },
      )
      .addMatcher(
        Apis.endpoints.deleteAccount.matchFulfilled,
        (state, action) => {
          console.log('action', action.payload);
          if (action.payload?.success) {
            state.user = {};
            state.token = null;
          }
        },
      );
  },
});

export const { logout, setUserType, logoutGuest, setUserData } = Slice.actions;

export default Slice.reducer;
