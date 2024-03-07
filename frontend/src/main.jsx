import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index={true} path="/" element={<HomePage />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
