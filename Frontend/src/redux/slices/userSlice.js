import { createSlice } from "@reduxjs/toolkit";

const getSavedUser = () => {
  try {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    return null;
  }
};

const savedUser = getSavedUser();

const userSlice = createSlice({
  name: "user",

  initialState: {
    currentUser: savedUser,
    isLoggedIn: Boolean(savedUser),
    error: null,
  },

  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      state.error = null;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );

      if (action.payload.role === "admin") {
        localStorage.setItem(
          "isAdmin",
          "true"
        );
      } else {
        localStorage.removeItem(
          "isAdmin"
        );
      }

      window.dispatchEvent(
        new Event("userChanged")
      );
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");

      window.dispatchEvent(
        new Event("userChanged")
      );
    },

    updateUser: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          state.currentUser
        )
      );

      window.dispatchEvent(
        new Event("userChanged")
      );
    },

    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  updateUser,
  clearUserError,
} = userSlice.actions;

export default userSlice.reducer;