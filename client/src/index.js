import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import routes from "./routes";
import { store } from "./store";
import {Provider} from 'react-redux';

const router = createBrowserRouter(routes);

const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </Provider>
    </React.StrictMode>
);
