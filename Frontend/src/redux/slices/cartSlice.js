import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart)
      ? parsedCart
      : [];
  } catch (error) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(
    "cart",
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getInitialCart(),
  },

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existingProduct =
        state.items.find(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      if (existingProduct) {
        existingProduct.quantity =
          Number(
            existingProduct.quantity || 1
          ) + 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) ===
          String(action.payload)
      );

      if (item) {
        item.quantity =
          Number(item.quantity || 1) + 1;
      }

      saveCart(state.items);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) ===
          String(action.payload)
      );

      if (item) {
        item.quantity =
          Number(item.quantity || 1) - 1;
      }

      state.items = state.items.filter(
        (item) =>
          Number(item.quantity || 0) > 0
      );

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          String(item.id) !==
          String(action.payload)
      );

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;