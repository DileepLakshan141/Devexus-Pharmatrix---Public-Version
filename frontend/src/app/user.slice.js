import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  username: null,
  user_id: null,
  email: null,
  telephone: null,
  user_role: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.access_token = action.payload.access_token;
      state.username = action.payload.username;
      state.user_id = action.payload.user_id;
      state.telephone = action.payload.telephone;
      state.user_role = action.payload.user_role;
      state.profile = action.payload.profile;
    },
    signout: (state) => {
      state.access_token = null;
      state.username = null;
      state.user_id = null;
      state.email = null;
      state.telephone = null;
      state.user_role = null;
      state.profile = null;
    },
    renew_token: (state, action) => {
      state.access_token = action.payload.access_token;
    },
  },
});

export const { signin, signout, renew_token } = userSlice.actions;

export default userSlice.reducer;
