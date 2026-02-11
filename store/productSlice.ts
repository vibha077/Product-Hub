
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductState } from '../types';

const initialState: ProductState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  selectedProduct: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to fetch products');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/add',
  async (product: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to add product');
      return data as Product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Failed to update product');
      return result as Product;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error('Failed to delete product');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { selectProduct } = productSlice.actions;
export default productSlice.reducer;
