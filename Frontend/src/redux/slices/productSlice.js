import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000";

export const fetchProducts =
  createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/products`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load products"
          );
        }

        const data = await response.json();

        return Array.isArray(data)
          ? data
          : [];
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchProductById =
  createAsyncThunk(
    "products/fetchProductById",
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Product not found"
          );
        }

        return await response.json();
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

const productSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    selectedProduct: null,
    loading: false,
    productLoading: false,
    error: null,
    productError: null,
  },

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Unable to load products";
        }
      )

      .addCase(
        fetchProductById.pending,
        (state) => {
          state.productLoading = true;
          state.productError = null;
          state.selectedProduct = null;
        }
      )

      .addCase(
        fetchProductById.fulfilled,
        (state, action) => {
          state.productLoading = false;
          state.selectedProduct =
            action.payload;
        }
      )

      .addCase(
        fetchProductById.rejected,
        (state, action) => {
          state.productLoading = false;
          state.productError =
            action.payload ||
            "Unable to load product";
        }
      );
  },
});

export const {
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;