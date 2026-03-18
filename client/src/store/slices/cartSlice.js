import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await cartAPI.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/addItem', async (data, { rejectWithValue }) => {
  try {
    const res = await cartAPI.addItem(data);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeItem', async (productId, { rejectWithValue }) => {
  try {
    const res = await cartAPI.removeItem(productId);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartAPI.clearCart();
    return [];
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  }
});

export default cartSlice.reducer;
