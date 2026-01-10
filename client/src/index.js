import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { BehaviorProvider } from "./context/BehaviorContext";
import routes from "./routes";

const router = createBrowserRouter(routes);

const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <BehaviorProvider>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </BehaviorProvider>
    </React.StrictMode>
);
