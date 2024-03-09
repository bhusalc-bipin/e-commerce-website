import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find(
                (cartItem) => cartItem._id === item._id
            );

            if (existItem) {
                state.cartItems = state.cartItems.map((cartItem) =>
                    cartItem._id === existItem._id ? item : cartItem
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (x) => x._id !== action.payload
            );

            return updateCart(state);
        },
        resetCart: (state) => (state = initialState),
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    resetCart,
    saveShippingAddress,
    savePaymentMethod,
} = cartSlice.actions;

export default cartSlice.reducer;
