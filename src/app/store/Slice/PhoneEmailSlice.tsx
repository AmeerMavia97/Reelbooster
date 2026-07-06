import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phone: "",
  email: "",
  country_code:"",
  country_short_name:"",
  country:""
};

const PhoneEmailSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPhone: (state, action) => {
      state.phone = action.payload.phone;
      state.country_code=action.payload.country_code;
      state.country_short_name=action.payload.country_short_name;
      state.country=action.payload.country;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    clearUserInfo: (state) => {
      state.phone = "";
      state.email = "";
    },
  },
});

export const { setUserPhone, setUserEmail, clearUserInfo } = PhoneEmailSlice.actions;
export default PhoneEmailSlice.reducer;
