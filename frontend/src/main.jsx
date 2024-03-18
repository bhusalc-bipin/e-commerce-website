import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import App from "./App";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ShippingPage from "./pages/ShippingPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrderListPage from "./pages/admin/OrderListPage.jsx";
import ProductListPage from "./pages/admin/ProductListPage.jsx";
import ProductEditPage from "./pages/admin/ProductEditPage.jsx";
import UserListPage from "./pages/admin/UserListPage.jsx";
import UserEditPage from "./pages/admin/UserEditPage.jsx";

import store from "./store.js";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<HomePage />} />
            <Route path="/search/:keyword" element={<HomePage />} />
            <Route path="/page/:pageNumber" element={<HomePage />} />
            <Route
                path="search/:keyword/page/:pageNumber"
                element={<HomePage />}
            />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="" element={<PrivateRoute />}>
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/placeorder" element={<PlaceOrderPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="" element={<AdminRoute />}>
                <Route path="/admin/orderlist" element={<OrderListPage />} />
                <Route
                    path="/admin/productlist"
                    element={<ProductListPage />}
                />
                <Route
                    path="/admin/productlist/:pageNumber"
                    element={<ProductListPage />}
                />
                <Route
                    path="/admin/product/:id/edit"
                    element={<ProductEditPage />}
                />
                <Route path="/admin/userlist" element={<UserListPage />} />
                <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
            </Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PayPalScriptProvider>
            <RouterProvider router={router} />
        </PayPalScriptProvider>
    </Provider>
);
