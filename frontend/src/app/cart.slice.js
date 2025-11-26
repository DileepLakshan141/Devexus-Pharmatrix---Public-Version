import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart_items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    upsertCartItem: (state, action) => {
      const { item, quantity, selectedUnit, unitName } = action.payload;
      const existingItemIndex = state.cart_items.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.selectedUnit === selectedUnit
      );

      if (existingItemIndex >= 0) {
        state.cart_items[existingItemIndex].quantity = quantity;
        state.cart_items[existingItemIndex].total_value =
          quantity * selectedUnit * item.sell_price;
        if (quantity === 0) {
          state.cart_items.splice(existingItemIndex, 1);
        }
      } else if (quantity > 0) {
        state.cart_items.push({
          id: item.id,
          batch_id: item.batch_id,
          name: item.name,
          manufacturer: item.manufacturer,
          sku: item.sku,
          exp_date: item.exp_date,
          sell_price: item.sell_price,
          cost_price: item.cost_price,
          selectedUnit: selectedUnit,
          quantity: quantity,
          unit_name: unitName,
          total_value: item.sell_price * quantity * selectedUnit,
        });
      }
    },

    removeFromCart: (state, action) => {
      const { itemId, selectedUnit } = action.payload;
      state.cart_items = state.cart_items.filter(
        (item) => !(item.id === itemId && item.selectedUnit === selectedUnit)
      );
    },

    clearCart: (state) => {
      state.cart_items = [];
    },
  },
});

export const { upsertCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
