import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification() {
      return null;
    },
  },
});

export const setNotificationWithTimeout = (message, seconds) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(removeNotification());
    }, seconds * 1000);
  };
};

export const { setNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
